import './StageProperties.css';
import './Tables.css';
import React from 'react';
import { ModalDialog } from '../general';
import { Discipline, StageDef } from '../models';
import { Spinner } from '.';

export class StageProperties extends React.Component {
	static register = { name: "StageProperties" };
	static wire = ["EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { visible: false, dirty: false };
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
		if (this.state.dirty) { this.fire(this.Events.updateCompetition); }
	}

	setVal = (stage, property, min, max, val) => {
		val = parseInt(val, 10);
		if (val >= min && val <= max) {
			stage[property] = val;
			this.setState({ dirty: true });
		}
	}

	toggleValue = stage => {
		stage.value = !stage.value;
		this.setState({ dirty: true });
	}

	Header = props => {
		let { showShots } = props;
		return <thead>
			<tr>
				<th key="hStn" className="header">Station</th>
				{showShots && <th key="hSh" className="header">Skott</th>}
				<th key="hTgt" className="header">Figurer</th>
				<th key="hVal" className="header">Poäng</th>
				<th key="hMax" className="header">Max</th>
				<th key="hMin" className="header">Min</th>
			</tr>
		</thead>;
	}

	Stage = props => {
		let { stage, showShots } = props;
		return <tr>
			<td key={stage.num + "Stn"}>{stage.num}</td>
			{showShots && <td><Spinner key={stage.num + "Sh"} value={stage.shots} onChange={v => this.setVal(stage, "shots", 3, 18, v)} /></td>}
			<td><Spinner key={stage.num + "Tgt"} value={stage.targets} onChange={v => this.setVal(stage, "targets", 1, 9, v)} /></td>
			<td key={stage.num + "Val"}><button className={"button small" + (stage.value ? " green" : "")} onClick={e => this.toggleValue(stage)}>{stage.value ? "Ja" : "Nej"}</button></td>
			<td><Spinner key={stage.num + "Max"} value={stage.max} onChange={v => this.setVal(stage, "max", 1, 6, v)} /></td>
			<td><Spinner key={stage.num + "Min"} value={stage.min} onChange={v => this.setVal(stage, "min", 0, 3, v)} /></td>
		</tr>;
	}

	render() {
		let { visible, event } = this.state;
		if (!visible) { return null; }
		let showShots = (event.discipline === Discipline.fieldK);
		return <ModalDialog title="Stationer" onClose={this.onClose} showClose="true">
			<div id="stages">
				<table id="stage-properties" className="table-light">
					<this.Header showShots={showShots} />
					<tbody>
						{event.stages.map(s => <this.Stage key={s.num} stage={s} showShots={showShots} />)}
					</tbody>
				</table>
				<div className="modal-buttons"><button id="ok" className="button" onClick={this.onClose}>OK</button></div>
			</div>
		</ModalDialog>
	}
}
