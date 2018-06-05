import React from 'react';

function Scores({ participant }) {
	let field = 1;
	return participant.score.map(s => <td key={field++}><input value={s} size="2" /></td>);
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

export function Results({ value, event }) {
	return <table>
		<thead>
			<tr>
				<th>Namn</th>
				<th>Förening</th>
				{series(event)}
			</tr>
		</thead>
		<tbody>
			{value.map(r => <tr key={r.id}>
				<td>{r.name}</td>
				<td>{r.organization}</td>
				<Scores participant={r} />
			</tr>)}
		</tbody>
	</table>;
}