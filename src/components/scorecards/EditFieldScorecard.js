import React from 'react';
import { TextInput } from '../Inputs';
import { Discipline } from '../../models';

export class EditFieldScorecard extends React.Component {
	static disciplines = [Discipline.fieldP];
	static editable = true;
	static targets = [1, 2, 3, 4, 5, 6];

	Header = () => {
		let i = 1;
		return [
			<div key={"h" + i++} className="header">Station</div>,
			<div key={"h" + i++} className="header">1</div>,
			<div key={"h" + i++} className="header">2</div>,
			<div key={"h" + i++} className="header">3</div>,
			<div key={"h" + i++} className="header">4</div>,
			<div key={"h" + i++} className="header">5</div>,
			<div key={"h" + i++} className="header">6</div>,
			<div key={"h" + i++} className="header">Totalt</div>,
			<div key={"h" + i++} className="header">Poäng</div>,
			<div key={"h" + i++} className="header">Omskjutning</div>
		]
	}

	updateValue = (stage, tgt, value) => {
		let { participant } = this.props;
		participant.setScore(stage.num, tgt, value || 0);
		this.setState({});
	}

	Target = ({ stage, score, tgt }) => {
		return tgt <= stage.targets ?
			<div style={{ padding: "2px" }}><TextInput mask="0123456" value={score === undefined ? "" : score} size="1" style={{ width: "2ex" }}
				onChange={e => this.updateValue(stage, tgt - 1, parseInt(e.target.value, 10))} /></div> :
			<div className="unused"></div>;
	}

	Value = ({ stage, score }) => {
		return stage.value ?
			<div style={{ padding: "2px" }}><TextInput mask="0123456789" value={score.values[stage.targets] === undefined ? "" : score.values[stage.targets]}
				onChange={e => this.updateValue(stage, stage.targets, parseInt(e.target.value, 10))} size="2" /></div> :
			<div className="unused"></div>;
	}

	Stage = ({ stage, participant }) => {
		let i = 1;
		let score = participant.scores.find(s => s.stage === stage.num) || [];
		return [
			<div key={"" + stage.num + i++}>{stage.num}</div>,
			EditFieldScorecard.targets.map(t => <this.Target key={"" + stage.num + i++} stage={stage} tgt={t} score={score.values[t - 1]} />),
			<div key={"" + stage.num + i++}>{participant.getStageTotal(stage)}</div>,
			<this.Value key={"" + stage.num + i++} stage={stage} score={score} />,
			<div key={"" + stage.num + i++}>{participant.redo === stage.num ? "Ja" : ""}</div>
		]
	}

	render() {
		let { event, participant } = this.props;
		let stages = event.stages.sort((a, b) => a.num - b.num);
		return <div className="scorecard">
			<this.Header />
			{stages.flatMap(s => <this.Stage key={"s" + s.num} stage={s} participant={participant} />)}
		</div>
	}
}