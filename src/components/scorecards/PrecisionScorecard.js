import React from 'react';
import { Discipline } from '../../models';
import { TextInput } from '../Inputs';

export class PrecisionScorecard extends React.Component {
	static disciplines = [Discipline.target];
	static targets = [1, 2, 3, 4, 5];

	Header() {
		let i = 1;
		return [
			<div key={"h" + i++} className="header">Station</div>,
			<div key={"h" + i++} className="header">1</div>,
			<div key={"h" + i++} className="header">2</div>,
			<div key={"h" + i++} className="header">3</div>,
			<div key={"h" + i++} className="header">4</div>,
			<div key={"h" + i++} className="header">5</div>,
			<div key={"h" + i++} className="header">Totalt</div>,
		]
	}

	Target = (num, i, participant, score) => <div key={"shot" + num + "-" + i}>{score || ""}</div>

	stage(num) {
		let { participant } = this.props;
		let score = participant.scores.find(s => s.stage === num) || [];
		return [
			<div key={"name" + num}>{num}</div>,
			PrecisionScorecard.targets.map((t, i) => this.Target(num, i, participant, score.values[i] === undefined ? "" : score.values[i])),
			<div key={"tot" + num}>{participant.getPrecisionTotal(num)}</div>,
		]
	}

	render() {
		return <div className="scorecard">
			<this.Header />
			{new Array(this.props.event.scores).fill(null).flatMap((n, i) => this.stage(i + 1, this.props.participant))}
		</div>
	}
}

export class EditPrecisionScorecard extends PrecisionScorecard {
	static disciplines = [Discipline.target];
	static editable = true;

	updateValue = (participant, stage, tgt, value) => {
		if (value === "") {
			participant.setScore(stage, tgt, undefined);
		} else if (value.toUpperCase() === "X") {
			participant.setScore(stage, tgt, "X");
		} else {
			value = parseInt(value, 10);
			if (!isNaN(value) && value >= 0 && value <= 10) {
				participant.setScore(stage, tgt, value);
			}
		}
		this.setState({});
	}

	Target = (num, i, participant, score) =>
		<div key={"shot" + num + "-" + i} style={{ padding: "2px" }}><TextInput mask="0123456789xX" value={score} size="2" style={{ width: "3ex" }}
			onChange={e => this.updateValue(participant, num, i, e.target.value)} /></div>
}