import React from 'react';
import { Discipline } from '../../models';
import { TextInput } from '../Inputs';

const five_targets = [1, 2, 3, 4, 5];
const ten_targets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export class Scorecard extends React.Component {
	targets = [];

	Header = () => {
		let i = 1;
		return [
			<div key={"h" + i++} className="header">Serie</div>,
			...this.targets.map(n => <div key={"h" + i++} className="header">{n}</div>),
			<div key={"h" + i++} className="header">Totalt</div>,
		]
	}

	Target = (num, i, participant, score) => <div key={"shot" + num + "-" + i}>{score || ""}</div>

	stage(num) {
		let { participant } = this.props;
		let score = participant.scores.find(s => s.stage === num) || [];
		return [
			<div key={"name" + num}>{num}</div>,
			this.targets.map((t, i) => this.Target(num, i, participant, score.values[i] === undefined ? "" : score.values[i])),
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

export class PrecisionScorecard extends Scorecard {
	static disciplines = [Discipline.target, Discipline.sport5];
	targets = five_targets;
}

export class Sport10Scorecard extends Scorecard {
	static disciplines = [Discipline.sport10];
	targets = ten_targets;
}

export class EditScorecard extends Scorecard {
	constructor(props) {
		super(props);
		this.mask = "0123456789xX";
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

	Target = (num, i, participant, score) =>
		<div key={"shot" + num + "-" + i} style={{ padding: "2px" }}><TextInput mask={this.mask} value={score} size="2" style={{ width: "3ex" }}
			onChange={e => this.updateValue(participant, num, i, e.target.value)} /></div>
}

export class EditPrecisionScorecard extends EditScorecard {
	static disciplines = [Discipline.target, Discipline.sport5];
	static editable = true;
	targets = five_targets;
}

export class EditSport10Scorecard extends EditScorecard {
	static disciplines = [Discipline.sport10];
	static editable = true;
	targets = ten_targets;
}