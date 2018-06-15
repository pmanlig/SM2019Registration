import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { withTitle } from '../components';
import { Permissions, Status, Operations } from '../models';
import { Components, Events } from '.';

const initialCompetitions = [
	{
		id: "sm2019",
		name: "SM 2019 (Test)",
		url: "/sm2019.json",
		description: "SM i precision, fält och milsnabb 2019",
		status: Status.Hidden,
		permissions: Permissions.Own
	},
	{
		id: "gf2018",
		name: "Gävligfälten 2018 (Test)",
		url: "/gf2018.json",
		description: "Gävligfälten 2018",
		status: Status.Open,
		permissions: Permissions.Admin
	}
];

export const CompetitionList = withTitle("Anmälningssytem Gävle PK", class extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { competitions: initialCompetitions };
		this.subscribe(Events.userChanged, () => this.loadCompetitions());
		this.loadCompetitions();
	}

	loadCompetitions() {
		fetch('https://dev.bitnux.com/sm2019/competition')
			.then(result => result.json())
			.then(json => this.setState({ competitions: initialCompetitions.concat(json.map(c => { return { permissions: Permissions.Any, ...c, status: Status.Open }; })) }));
	}

	getToken(c) {
		let tokens = this.inject(Components.Storage).get("Tokens");
		if (!tokens) { return undefined; }
		return tokens[c.id];
	}

	competition(competition) {
		let links = Operations.filter(o => (
			competition.permissions === Permissions.Own ||
			(competition.permissions >= o.permission && (o.status === undefined || o.status === competition.status))
		));
		return <li key={competition.id}>
			<Link className="competitionLink" to={"/competition/" + competition.id}>{competition.name}</Link>
			{links.map(l =>
				<span key={l.name}>&nbsp;<Link to={"/competition/" + competition.id + "/" + l.path}>{l.name}</Link>&nbsp;</span>)}
		</li>
	}

	render() {
		let session = this.inject(Components.Session);
		let loggedIn = session.user !== "";
		return <div id='competitions' className='content'>
			<h1>Tävlingar</h1>
			<ul>
				{this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own)).map(c => this.competition(c))}
				{loggedIn && <li><Link className="competitionLink" to="/create">Skapa ny tävling</Link></li>}
			</ul>
		</div>;
	}
});