import React from 'react';

function Scores({ participant }) {
	let field = 1;
	return participant.score.map(s => <td key={field++}><input value={s} size="2" /></td>);
}

export function Results(props) {
	return <table>
		<thead>
			<tr>
				<th>Namn</th>
				<th>Förening</th>
				<th className="round">1</th>
				<th className="round">2</th>
				<th className="round">3</th>
				<th className="round">4</th>
				<th className="round">5</th>
				<th className="round">6</th>
				<th className="round">7</th>
				<th className="round">8</th>
			</tr>
		</thead>
		<tbody>
			{props.value.map(r => <tr key={r.id}>
				<td>{r.name}</td>
				<td>{r.organization}</td>
				<Scores participant={r} />
			</tr>)}
		</tbody>
	</table>;
}