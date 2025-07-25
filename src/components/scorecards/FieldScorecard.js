import React from 'react';
import { Discipline } from '../../models';

const six_targets = [1, 2, 3, 4, 5, 6];

export class FieldScorecard extends React.Component {
	static disciplines = [Discipline.fieldP, Discipline.fieldK, Discipline.scoredP, Discipline.scoredK];
	targets = six_targets;

	Header = () => {
		let i = 1;
		return [
			<div key={"h" + i++} className="header">Station</div>,
			...this.targets.map(n => <div key={"h" + i++} className="header">{n}</div>),
			<div key={"h" + i++} className="header">Totalt</div>,
			<div key={"h" + i++} className="header">Poäng</div>,
			<div key={"h" + i++} className="header">Omskjutning</div>
		]
	}

	Target = ({ stage, score, tgt }) => {
		return tgt <= stage.targets ?
			<div>{score || ""}</div> :
			<div className="unused"></div>;
	}

	Value = ({ stage, score }) => {
		return stage.value ?
			<div>{score.values[stage.targets] !== undefined ? score.values[stage.targets] : ""}</div> :
			<div className="unused"></div>;
	}

	Stage = ({ stage, participant }) => {
		let i = 1;
		let score = participant.scores.find(s => s.stage === stage.num) || [];
		return [
			<div key={"" + stage.num + i++}>{stage.num}</div>,
			this.targets.map(t => <this.Target key={"" + stage.num + i++} stage={stage} tgt={t} score={score.values[t - 1]} />),
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