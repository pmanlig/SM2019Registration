import React from "react";
import { Link } from 'react-router-dom';
import { Discipline } from "../../models";
import { PointFieldScore, StdFieldScore } from "../../logic";

let sort = (a, b) => {
	let pos = 0;
	while (pos < a.total.length && pos < b.total.length) {
		if (a.total[pos] === b.total[pos]) { pos++; }
		else { return b.total[pos] - a.total[pos]; }
	}
	pos = a.scores.length;
	while (pos-- > 0) {
		if (a.scores[pos] !== b.scores[pos]) { return b.scores[pos] - a.scores[pos]; }
		if (a.targets[pos] !== b.targets[pos]) { return b.targets[pos] - a.targets[pos]; }
	}
	return 0;
}

export class FieldResult extends React.Component {
	static disciplines = [Discipline.fieldP, Discipline.fieldK, Discipline.scoredP, Discipline.scoredK];

	constructor(props) {
		super(props);
		this.scorer = (props.event.discipline === Discipline.fieldP || props.event.discipline === Discipline.fieldK) ?
			StdFieldScore : PointFieldScore;
	}

	Header = props => {
		let scores = [], s = 0;
		while (s++ < props.event.scores) { scores.push(<th key={s}>{s}</th>); }
		return <thead>
			<tr>
				<th>Plac</th>
				<th className="left">Namn</th>
				<th className="left">Förening</th>
				{props.event.classes > 0 && <th className="left">Klass</th>}
				{scores}
				<th>Summa</th>
				{props.showValues && <th>Poäng</th>}
				<th>Std</th>
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, pos, event } = props;
		let { id, name, organization, scores, targets, total, std } = data;
		let txts = [];
		for (let i = 0; i < scores.length; i++) {
			txts[i] = <td key={i}>{`${scores[i]}/${targets[i]}`}</td>;
		}

		return <tr className={pos === 1 ? "first" : (pos % 2 === 0 ? "even" : undefined)}>
			<td>{pos}</td>
			<td className="left"><Link to={props.linkBase + id}>{name}</Link></td>
			<td className="left">{organization}</td>
			{event.classes > 0 && <td>{data.class}</td>}
			{txts}
			<td>{this.scorer.finalScore(total)}</td>
			{props.showValues && <td>{total[2]}p</td>}
			<td>{std}</td>
		</tr>
	}

	assignStd(scores) {
		let sBreak = Math.floor(scores.length / 9);
		let bBreak = Math.floor(scores.length / 3);
		let sLim = 48, bLim = 48;
		scores.forEach((s, i) => {
			if (i < sBreak || s.total[0] === sLim) {
				s.std = "S";
				sLim = s.total[0];
				bLim = s.total[0];
			} else if (i < bBreak || s.total[0] === bLim) {
				s.std = "B";
				bLim = s.total[0];
			}
		});
		return scores;
	}

	scores(results, filter) {
		let { competition, event, division } = this.props;
		let showValues = event.stages.some(s => s.value);
		let linkBase = `/competition/${competition.id}/results/${event.id}/${division && isNaN(division) ? `${division}/` : ""}`;
		filter = filter.toUpperCase();
		return results
			.sort((a, b) => sort(a, b))
			.map((p, i) => { return { ...p, pos: i + 1 } })
			.filter(p => p.name.toUpperCase().includes(filter) || p.organization.toUpperCase().includes(filter))
			.map(p => <this.Participant key={p.id} pos={p.pos} event={event} data={p} showValues={showValues} linkBase={linkBase} />);
		// .concat([<tr key={results[0].class}><td>&nbsp;</td></tr>]);
	}

	render() {
		let { event, filter } = this.props;
		let showValues = event.stages.some(s => s.value);
		let results = this.props.results.map(r => this.scorer.calculateScores(r, event));
		this.assignStd(results.flat().sort((a, b) => sort(a, b)));
		return <table className="score-table">
			<this.Header event={event} showValues={showValues} />
			<tbody>
				{results.flatMap(r => this.scores(r, filter))}
			</tbody>
		</table>;
	}
}