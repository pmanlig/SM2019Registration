import React from 'react';

function Scores({ participant }) {
	let field = 1;
	return participant.score.map(s => <td key={field++}><input value={s} size="2" /></td>);
}

function Sum({ participant }) {
	console.log(participant);
	return <td>{participant.score.reduce((acc, curr) => parseInt(acc, 10) + parseInt(curr, 10))}</td>;
}

function series(event) {
	if (null === event) {
		return null;
	}
	let s = [];
	for (let i = 1; i <= event.series; i++) {
		s.push(<th key={i} className="round">{i}</th>);
	}
	return s;
}

export function ResultsTable({ value, event }) {
	return <table>
		<thead>
			<tr>
				<th>Namn</th>
				<th>Förening</th>
				{series(event)}
				<th>Summa</th>
			</tr>
		</thead>
		<tbody>
			{value.scores.map(r => <tr key={r.id}>
				<td>{r.name}</td>
				<td>{r.organization}</td>
				<Scores participant={r} />
				<Sum participant={r} />
			</tr>)}
		</tbody>
	</table>;
}