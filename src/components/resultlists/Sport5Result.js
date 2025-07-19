import React from "react";
import { Link } from 'react-router-dom';
import { Discipline } from "../../models";

const sort = (a, b) => {
	let pos = 0;
	while (pos < a.total.length && pos < b.total.length) {
		if (a.total[pos] === b.total[pos]) { pos++; }
		else { return b.total[pos] - a.total[pos]; }
	}
	pos = a.scores.length;
	while (pos-- > 0) {
		if (a.scores[pos] !== b.scores[pos]) { return b.scores[pos] - a.scores[pos]; }
	}
	return 0;
}

export class Sport5Result extends React.Component {
	static disciplines = [Discipline.sport5];

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
				<th>X</th>
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, pos, event } = props;
		let { id, name, organization, scores, total } = data;
		let txts = [];
		for (let i = 0; i < event.scores; i++) {
			txts[i] = <td key={i}>{scores[i]}</td>;
		}

		return <tr className={pos === 1 ? "first" : (pos % 2 === 0 ? "even" : undefined)}>
			<td>{pos}</td>
			<td className="left"><Link to={props.linkBase + id}>{name}</Link></td>
			<td className="left">{organization}</td>
			{event.classes > 0 && <td>{data.class}</td>}
			{txts}
			<td>{total[0]}</td>
			<td>{total[1]}</td>
		</tr>
	}

	scores(results, filter) {
		let { competition, event, division } = this.props;
		let linkBase = `/competition/${competition.id}/results/${event.id}/${division && isNaN(division) ? `${division}/` : ""}`;
		filter = filter.toUpperCase();
		return results
			.sort((a, b) => sort(a, b))
			.map((p, i) => { return { ...p, pos: i + 1 } })
			.filter(p => p.name.toUpperCase().includes(filter) || p.organization.toUpperCase().includes(filter))
			.map(p => <this.Participant key={p.id} pos={p.pos} event={event} data={p} linkBase={linkBase} />);
		// .concat([<tr key={results[0].class}><td>&nbsp;</td></tr>]);
	}

	calculateScores(results) {
		const sum = (a, b) => a + b;
		return results.map(p => {
			let scores = [];
			let Xs = 0;
			p.scores.forEach(s => {
				scores[s.stage - 1] = s.values.filter(v => v !== undefined).map(v => v === "X" ? 10 : v).reduce(sum, 0);
				Xs += s.values.filter(s => s === "X").length;
			});
			return {
				id: p.id,
				name: p.name,
				organization: p.organization,
				scores: scores,
				class: p.class,
				total: [scores.reduce(sum, 0), Xs]
			}
		});

	}

	render() {
		let { event, filter } = this.props;
		let results = this.props.results.map(r => this.calculateScores(r));
		return <table className="score-table">
			<this.Header event={event} />
			<tbody>
				{results.flatMap(r => this.scores(r, filter))}
			</tbody>
		</table >;
	}
}