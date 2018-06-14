import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { withTitle } from '../components';
import { Components, Events } from '.';
import { Permissions, Status } from '../models';

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
			.then(json => this.setState({ competitions: initialCompetitions.concat(json.map(c => { return { permissions: Permissions.Any, ...c }; })) }));
	}

	getToken(c) {
		let tokens = this.inject(Components.Storage).get("Tokens");
		if (!tokens) { return undefined; }
		return tokens[c.id];
	}

	competition(competition) {
		let token = this.getToken(competition);
		return <li key={competition.id}>
			<Link to={"/competition/" + competition.id}>{competition.name}</Link>
			{competition.permissions >= Permissions.Any && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/register" + (token !== undefined ? "/" + token : "")}>(Anmälan)</Link></span>)}
			{competition.permissions >= Permissions.Admin && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/report"}>(Rapportera)</Link></span>)}
			{competition.permissions >= Permissions.Any && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/results"}>(Resultat)</Link></span>)}
			{competition.permissions >= Permissions.Own && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/admin"}>(Administrera)</Link></span>)}
		</li>
	}

	render() {
		let session = this.inject(Components.Session);
		let loggedIn = session.user !== "";
		return <div id='competitions' className='content'>
			<h1>Tävlingar</h1>
			<ul>
				{this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own)).map(c => this.competition(c))}
				{loggedIn && <li><Link to="/create">Skapa ny tävling</Link></li>}
			</ul>
		</div>;
	}
});