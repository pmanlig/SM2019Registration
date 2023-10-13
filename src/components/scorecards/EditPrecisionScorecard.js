import React from 'react';
import { TextInput } from '../Inputs';
import { Discipline } from '../../models';

export class EditPrecisionScorecard extends React.Component {
	static disciplines = [Discipline.target];
	static editable = true;
	static targets = [1, 2, 3, 4, 5];

	Header = () => {
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

	stage(num, participant) {
		let score = participant.scores.find(s => s.stage === num) || [];
		return [
			<div key={"name" + num}>{num}</div>,
			EditPrecisionScorecard.targets.map((t, i) =>
				<div key={"shot" + num + "-" + i} style={{ padding: "2px" }}><TextInput mask="0123456789xX" value={score.values[i] === undefined ? "" : score.values[i]} size="2" style={{ width: "3ex" }}
					onChange={e => this.updateValue(participant, num, i, e.target.value)} /></div>),
			<div key={"tot" + num}>{participant.getPrecisionTotal(num)}</div>,
		]
	}

	render() {
		let { event, participant } = this.props;
		return <div className="scorecard">
			<this.Header />
			{new Array(event.scores).fill(null).flatMap((n, i) => this.stage(i + 1, participant))}
		</div>
	}
}