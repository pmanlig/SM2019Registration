import React from "react";

let sum = (a, b) => a + b;
let tgt = x => x > 0;
let sort = (a, b) => {
	let pos = 0;
	while (pos < a.length && pos < b.length) {
		if (a[pos] === b[pos]) { pos++; }
		else { return b[pos] - a[pos]; }
	}
	return 0;
}

export class FieldResult extends React.Component {
	Header = props => {
		let scores = [], s = 0;
		while (s++ < props.event.scores) { scores.push(<th key={s}>{s}</th>); }
		return <thead>
			<tr>
				<th>Plac</th>
				<th className="left">Namn</th>
				<th className="left">Förening</th>
				{scores}
				<th>Summa</th>
				{props.showValues && <th>Poäng</th>}
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, pos } = props;
		let { name, organization, scores, targets, total } = data;
		let txts = [];
		for (let i = 0; i < scores.length; i++) {
			txts[i] = <td key={i}>{`${scores[i]}/${targets[i]}`}</td>;
		}

		return <tr>
			<td>{pos}</td>
			<td className="left">{name}</td>
			<td className="left">{organization}</td>
			{txts}
			<td>{total[0]}/{total[1]}</td>
			{props.showValues && <td>{total[2]}p</td>}
		</tr>
	}

	render() {
		let { event, results } = this.props;
		let showValues = event.stages.some(s => s.value);
		let stages = [];
		event.stages.forEach(s => stages[s.num] = s);
		let participants = results.scores.map(p => {
			let scores = [], targets = [], value = 0;
			for (let i = 0; i < event.scores; i++) {
				scores[i] = 0;
				targets[i] = 0;
			}
			p.scores.forEach(s => {
				if (s.stage <= event.scores) {
					let score = [...s.values];
					if (stages[s.stage].value) { value += score.pop(); }
					scores[s.stage - 1] = score.reduce(sum);
					targets[s.stage - 1] = score.filter(tgt).length;
				}
			});
			return {
				id: p.id,
				name: p.name,
				organization: p.organization,
				scores: scores,
				targets: targets,
				total: [scores.reduce(sum), targets.reduce(sum), value]
			}
		});
		participants.sort((a, b) => sort(a.total, b.total));
		let pos = 1;
		return <div id="result">
			<table>
				<this.Header event={event} showValues={showValues} />
				<tbody>
					{participants.map(p => <this.Participant key={p.id} pos={pos++} data={p} showValues={showValues} />)}
				</tbody>
			</table>
		</div>;
	}
}