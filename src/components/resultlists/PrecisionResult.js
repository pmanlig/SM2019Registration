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

export class PrecisionResult extends React.Component {
	static disciplines = [Discipline.target];

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
				<th>Std</th>
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, pos, event } = props;
		let { id, name, organization, scores, total, std } = data;
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
			<td>{std}</td>
		</tr>
	}

	getBreaks(event, group) {
		if (Discipline.target === event.discipline)
			if (["M1", "M2", "M3", "M4"].includes(group)) return { s: 282, b: 274 }
		if ("M5" === group) return { s: 294, b: 288 }
		if (["M6", "M7"].includes(group)) return { s: 270, b: 253 }
		if ("A" === group) {
			if (6 === event.scores) return { s: 277, b: 267 }
			if (7 === event.scores) return { s: 323, b: 312 }
			if (10 === event.scores) return { s: 461, b: 445 }
		}
		if ("B" === group) {
			if (6 === event.scores) return { s: 282, b: 273 }
			if (7 === event.scores) return { s: 329, b: 319 }
			if (10 === event.scores) return { s: 470, b: 455 }
		}
		if ("C" === group) {
			if (6 === event.scores) return { s: 283, b: 276 }
			if (7 === event.scores) return { s: 330, b: 322 }
			if (10 === event.scores) return { s: 471, b: 460 }
		}
		return { s: 1000, b: 1000 }
	}

	assignStd(scores) {
		let fixedBreaks = this.getBreaks(this.props.event, this.props.division);
		let sBreak = Math.floor(scores.length / 9);
		let bBreak = Math.floor(scores.length / 3);
		let sLim = fixedBreaks.s, bLim = fixedBreaks.b;
		scores.forEach((s, i) => {
			if (i < sBreak || s.total[0] >= sLim) {
				s.std = "S";
				if (s.total[0] < sLim) { sLim = s.total[0]; }
				if (s.total[0] < bLim) { bLim = s.total[0]; }
			} else if (i < bBreak || s.total[0] >= bLim) {
				s.std = "B";
				if (s.total[0] < bLim) { bLim = s.total[0]; }
			}
		});
		return scores;
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
		this.assignStd(results.flat().sort((a, b) => sort(a, b)), event);
		return < table >
			<this.Header event={event} />
			<tbody>
				{results.flatMap(r => this.scores(r, filter))}
			</tbody>
		</table >;
	}
}