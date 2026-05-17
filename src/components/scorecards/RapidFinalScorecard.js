import React from 'react';
import { Discipline } from '../../models';
import { TextInput } from '../Inputs';
import { five_targets, Scorecard } from './Scorecard';

export class RapidFinalScorecard extends Scorecard {
	static disciplines = [Discipline.rapidFinal];
	targets = five_targets;
	tiebreaker = true;
}

export class EditRapidFinalScorecard extends RapidFinalScorecard {
	static discipline = [Discipline.rapidFinal];
	static editable = true;

	constructor(props) {
		super(props);
		this.mask = "-01";
	}

	updateValue = (participant, stage, tgt, value) => {
		if (value === "") {
			participant.setScore(stage, tgt, undefined);
		} else if (value === "-") {
			participant.setScore(stage, tgt, value);
		} else {
			value = parseInt(value, 10);
			if (!isNaN(value) && value >= -1 && value <= 1) {
				participant.setScore(stage, tgt, value);
			}
		}
		this.setState({});
	}

	Target = (num, i, participant, score) =>
		<div key={"shot" + num + "-" + i} style={{ padding: "2px" }}><TextInput mask={this.mask} value={score} size="2" style={{ width: "3ex" }}
			onChange={e => this.updateValue(participant, num, i, e.target.value)} /></div>
}