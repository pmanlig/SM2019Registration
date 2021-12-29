import './ReportTable.css';
import React from 'react';
import { ScoreTypes } from '../models';

/*
function Round({ participant, round, change }) {
	let rounds = [];
	for (let j = 0; j < participant.score[round].length; j++) {
		if (j > 0) {
			rounds.push(" / ");
		}
		rounds.push(<input key={j} className="score" value={participant.score[round][j]} size="2" onChange={e => change(round, j, e.target.value)} />);
	}
	return rounds;
}

function Scores({ participant, change }) {
	let scores = [];
	for (let i = 0; i < participant.score.length; i++) {
		scores.push(<td key={i} className="score">
			<Round participant={participant} round={i} change={change} />
		</td>);
	}
	return scores;
}

function Sum({ participant }) {
	return <td className="score">{participant.total.join("/")}</td>;
}

function series(stages) {
	return stages.map(s => <th key={s.num} className="stage">{s.num}</th>);
}
//*/

export class ReportTable extends React.Component {
	static register = { name: "ReportTable" };
	static fieldTargets = ["A", "B", "C", "D", "E", "F"];
	static fieldTargetIds = [0, 1, 2, 3, 4, 5];
	static targetValues = [0, 1, 2, 3, 4, 5, 6];


	static getClassName() {
		if (this.props.results.scoreType === ScoreTypes.Field) {
			return "scoreSheetField";
		}
		return "scoreSheetTarget";
	}

	headers(stageDef) {
		return ReportTable.fieldTargetIds.map(i =>
			(stageDef !== undefined && i < stageDef.targets) ?
				<div key={"hdr" + i} className="header">{ReportTable.fieldTargets[i]}</div> :
				<div />
		);
	}

	setScore = (participant, target, value) => {
		let stage = this.props.stage;
		if (participant.score[stage] === undefined) { participant.score[stage] = []; }
		participant.score[stage][target] = value;
		this.setState({});
	}

	setValue = (participant, stageDef, value) => {
		let stage = this.props.stage;
		if (participant.score[stage] === undefined) { participant.score[stage] = []; }
		participant.score[stage][stageDef.targets] = value;
		// this.setState({});
	}

	targets(stageDef, participant) {
		let scores = participant.score[this.props.stage] || [];
		return ReportTable.fieldTargetIds.map(i => <div key={participant + i}>
			{i < stageDef.targets ? <div className="participant input">
				{ReportTable.targetValues.filter(v => v <= stageDef.max).map(v =>
					<input key={"tgt" + i + v} className={"score-button" + (scores !== undefined && scores[i] === v ? " selected" : "")}
						type="button" value={v} onClick={e => this.setScore(participant, i, v)} />)}
			</div> : <div />}
		</div>);
	}

	value(stageDef, participant) {
		let scores = participant.score[this.props.stage] || [];
		return <div className="participant">
			<input className="score-text" type="text" size="2" value={scores[stageDef.targets]}
				onChange={e => this.setValue(participant, stageDef, e.target.value)} />
		</div>;
	}

	total(stageDef, participant, stage) {
		let score = participant.score[stage] || [];
		score = score.slice(0, stageDef.targets)
		return <div className="participant">{score.reduce((a, b) => a + b, 0)}/{score.filter(s => s > 0).length}</div>;
	}

	render() {
		let { results, squad, stage } = this.props;
		if (results.stageDefs === undefined) return null;
		if (results.stageDefs[stage] === undefined) return null;
		if (results.scores === undefined) return null;
		let stageDef = results.stageDefs[stage];
		let scores = results.scores;
		if (squad) { scores = scores.filter(s => s.squad === squad.id); }
		return <div className={"score-sheet field"}>
			<div className="header name">Namn</div>
			{this.headers(stageDef)}
			<div className="header">Total</div>
			{stageDef.values ? <div className="header">Poäng</div> : <div />}
			<div>{/* Spacer - empty space to let the interface resize */}</div>
			{scores.map(p => [
				<div key={p.name} className="participant name">{p.name}</div>,
				[...this.targets(results.stageDefs[stage], p)],
				this.total(stageDef, p, stage),
				stageDef.values ? this.value(stageDef, p) : <div />,
				<div>{/* Spacer - empty space to let the interface resize */}</div>
			]).flat()}
		</div>;
	}
}