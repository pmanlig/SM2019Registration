import React from "react";
// import { Link } from 'react-router-dom';
import { Discipline } from "../../models";
import { PointFieldScore, StdFieldScore } from "../../logic";

let sort = (a, b) => {
	let pos = 0;
	while (pos < a.total.length && pos < b.total.length) {
		if (a.total[pos] === b.total[pos]) { pos++; }
		else { return b.total[pos] - a.total[pos]; }
	}
	/* TODO: How to implement for teams???
	pos = a.scores.length;
	while (pos-- > 0) {
		if (a.scores[pos] !== b.scores[pos]) { return b.scores[pos] - a.scores[pos]; }
		if (a.targets[pos] !== b.targets[pos]) { return b.targets[pos] - a.targets[pos]; }
	}
	*/
	return 0;
}

function Header({ event, showValues }) {
	let scores = [], s = 0;
	while (s++ < event.scores) { scores.push(<th key={s}>{s}</th>); }
	return <thead>
		<tr>
			<th>Plac</th>
			<th className="left">Namn</th>
			<th className="left">Förening</th>
			{event.classes > 0 && <th className="left">Klass</th>}
			{scores}
			<th>Summa</th>
			{showValues && <th>Poäng</th>}
		</tr>
	</thead>;
}

function Summary({ pos, team, finalScore, event, showValues }) {
	let scores = [], s = 0;
	while (s++ < event.scores) { scores.push(<td key={s}></td>); }

	return <tr>
		<td>{pos}</td>
		<td className="left">{team.name}</td>
		<td className="left">{team.organization}</td>
		<td>{/* Class is empty */}</td>
		{scores}
		<td>{finalScore}</td>
		{showValues && <td>{team.total[2]}</td>}
	</tr>
}

function Participant({ data, finalScore, pos, event, showValues }) {
	if (data === undefined) return null;
	let { name, scores, targets, total } = data;
	let txts = [];
	for (let i = 0; i < scores.length; i++) {
		txts[i] = <td key={i}>{`${scores[i]}/${targets[i]}`}</td>;
	}

	return <tr className={pos % 2 === 0 ? "even" : undefined} >
		<td>{/* Position is empty */}</td>
		<td className="left">{name}</td>
		<td className="left">{/* Organization is empty */}</td>
		{event.classes > 0 && <td>{data.class}</td>}
		{txts}
		<td>{finalScore}</td>
		{showValues && <td>{total[2]}p</td>}
	</tr>

}

export class FieldResult extends React.Component {
	static disciplines = [Discipline.fieldP, Discipline.fieldK, Discipline.scoredP, Discipline.scoredK];

	constructor(props) {
		super(props);
		this.scorer = (props.event.discipline === Discipline.fieldP || props.event.discipline === Discipline.fieldK) ?
			StdFieldScore : PointFieldScore;
	}

	calcScores(team, event, results) {
		team.scores = team.members
			.concat(team.alternates)
			.map(id => parseInt(id, 10)).map(id => results.flat().find(r => r.id === id))
			.filter(s => s !== undefined);

		if (team.scores.length === 0) { return; }

		// Determine team members
		// TODO: Remove members that belong to other teams?!
		let teamDef = event.teams[parseInt(team.team_definition_id, 10)];
		if (teamDef === undefined) {console.log("teamDef is undefined", event.teams, team.team_definition_id);}
		let i = team.scores.length - 1;
		while (team.scores.length > teamDef.members) {
			if (i > -1) {
				if (team.scores[i].total[0] === 0) {
					team.scores.splice(i, 1);
				}
				i--;
			} else {
				team.scores.pop();
			}
		}

		// Add upp scores for team
		team.total = [...team.scores[0].total];
		for (i = 1; i < team.scores.length; i++) {
			for (let j = 0; j < team.total.length; j++) {
				team.total[j] += team.scores[i].total[j];
			}
		}
	}

	team(index, team, event, showValues) {
		let scores = team.scores.filter(s => s !== undefined).map((s, i) =>
			<Participant key={`p${index}${i}`} data={s} finalScore={this.scorer.finalScore(s.total)} pos={i} event={event} showValues={showValues} />);
		if (scores.length === 0) { return null; }
		return [
			<Summary key={`sum${index}`} pos={index + 1} team={team} finalScore={this.scorer.finalScore(team.total)} event={event} showValues={showValues} />,
			...scores
		];
	}

	scores(event, teams, filter, showValues) {
		// let linkBase = `/competition/${competition.id}/results/${event.id}/${division && isNaN(division) ? `${division}/` : ""}`;
		filter = filter.toUpperCase();
		const f = txt => txt.toUpperCase().includes(filter);
		teams = teams.flat();
		return teams
			.filter(t => f(t.name) || f(t.organization) || t.scores.some(p => f(p.name)))
			.map((t, i) => this.team(i, t, event, showValues))
	}

	render() {
		let { event, teams, filter } = this.props;
		let showValues = event.stages.some(s => s.value);
		let results = this.props.results.map(r => this.scorer.calculateScores(r, event));
		teams = teams.flat().filter(t => parseInt(t.event, 10) === event.id);
		teams.forEach(t => this.calcScores(t, event, results));
		teams = teams.filter(t => t.scores.length > 0).sort(sort);
		if (teams.length === 0) { return null; }
		return <table className="score-table">
			<Header event={event} showValues={showValues} />
			<tbody>
				{this.scores(event, teams, filter, showValues)}
			</tbody>
		</table>;
	}
}