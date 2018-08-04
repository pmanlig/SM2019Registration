import React from 'react';

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

export class ResultsTable extends React.Component {
	static register = true;

	render() {
		let { results, event } = this.props;
		return <table>
			<thead>
				<tr>
					<th>Namn</th>
					<th style={{ paddingRight: "40px" }}>Förening</th>
					{series(event)}
					<th>Summa</th>
				</tr>
			</thead>
			<tbody>
				{results.scores.map(p => <tr key={p.id} className={p.dirty && "dirty"}>
					<td>{p.name}</td>
					<td>{p.organization}</td>
					<Scores participant={p} change={(i, j, value) => results.update(p, i, j, value)} />
					<Sum participant={p} />
				</tr>)}
			</tbody>
		</table>;
	}
}