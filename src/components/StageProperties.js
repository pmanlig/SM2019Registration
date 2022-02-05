import './StageProperties.css';
import React from 'react';
import { ModalDialog } from '../general';
import { Discipline, StageDef } from '../models';
import { Spinner } from '.';

export class StageProperties extends React.Component {
	static register = { name: "StageProperties" };
	static wire = ["EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { visible: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.editStages, this.editStages);
	}

	editStages = event => {
		if (event.stages === undefined) event.stages = [];
		while (event.stages.length < event.scores) { event.stages.push(new StageDef(event.stages.length)); }
		while (event.stages.length > event.scores) { event.stages.pop(); }
		this.setState({ visible: true, event: event });
	}

	onClose = e => {
		this.setState({ visible: false });
		this.fire(this.Events.competitionUpdated);
	}

	setVal = (stage, property, min, max, val) => {
		val = parseInt(val, 10);
		if (val >= min && val <= max) { stage[property] = val; }
		this.setState({});
	}

	toggleValue = stage => {
		stage.value = !stage.value;
		this.setState({});
	}

	Header = props => {
		let { showShots } = props;
		return [
			<div key="hStn" className="header">Station</div>,
			showShots ? <div key="hSh" className="header">Skott</div> : <div key="hSh" className="hidden" />,
			<div key="hTgt" className="header">Figurer</div>,
			<div key="hVal" className="header">Poäng</div>,
			<div key="hMax" className="header">Max</div>,
			<div key="hMin" className="header">Min</div>
		];
	}

	Stage = props => {
		let { stage, showShots } = props;
		return [
			<div key={stage.num + "Stn"}>{stage.num}</div>,
			showShots ? <Spinner key={stage.num + "Sh"} value={stage.shots} onChange={v => this.setVal(stage, "shots", 3, 18, v)} /> : <div key={stage.num + "Sh"} className="hidden" />,
			<Spinner key={stage.num + "Tgt"} value={stage.targets} onChange={v => this.setVal(stage, "targets", 1, 9, v)} />,
			<div key={stage.num + "Val"}><button className={"button small" + (stage.value ? " green" : "")} onClick={e => this.toggleValue(stage)}>{stage.value ? "Ja" : "Nej"}</button></div>,
			<Spinner key={stage.num + "Max"} value={stage.max} onChange={v => this.setVal(stage, "max", 1, 6, v)} />,
			<Spinner key={stage.num + "Min"} value={stage.min} onChange={v => this.setVal(stage, "min", 0, 3, v)} />
		];
	}

	render() {
		let { visible, event } = this.state;
		if (!visible) { return null; }
		let showShots = (event.discipline === Discipline.fieldK);
		return <ModalDialog title="Stationer" onClose={this.onClose} showClose="true">
			<div id="stages">
				<div id="stage-properties">
					<this.Header showShots={showShots} />
					{event.stages.map(s => <this.Stage key={s.num} stage={s} showShots={showShots} />)}
				</div>
				<div className="tools"><button id="ok" className="button" onClick={this.onClose}>OK</button></div>
			</div>
		</ModalDialog>
	}
}
