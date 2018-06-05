import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { withTitle } from '../components';
import { Components, Events } from '.';

const initialCompetitions = [
	{
		id: "sm2019",
		name: "SM 2019 (Test)",
		url: "/sm2019.json",
		description: "SM i precision, fält och milsnabb 2019",
		status: "Open",
		permissions: "Own"
	},
	{
		id: "gf2018",
		name: "Gävligfälten 2018 (Test)",
		url: "/gf2018.json",
		description: "Gävligfälten 2018",
		status: "Open",
		permissions: "Admin"
	}
];

function Competition({ competition, token }) {
	let link = "/competition/" + competition.id + "/register" + (token !== undefined ? "/" + token : "");
	return <li>
		<Link to={link}>{competition.name}</Link>
		{competition.permissions === "Own" && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/admin"}>(Administrera)</Link></span>)}
		{competition.permissions !== "Participate" && (<span>&nbsp;<Link to={"/competition/" + competition.id + "/report"}>(Rapportera)</Link></span>)}
	</li>
}

export const CompetitionList = withTitle("Anmälningssytem Gävle PK", class extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {
			competitions: initialCompetitions
		};
		this.subscribe(Events.userChanged, () => this.setState({}));
		fetch('https://dev.bitnux.com/sm2019/competition')
			.then(result => result.json())
			.then(json => this.setState({ competitions: this.state.competitions.concat(json.map(c => { return { permissions: "Participate", ...c }; })) }));
	}

	getToken(c) {
		let tokens = this.inject(Components.Storage).get("Tokens");
		if (!tokens) { return undefined; }
		return tokens[c.id];
	}

	render() {
		let session = this.inject(Components.Session);
		let loggedIn = session.user !== "";
		// ToDo: Should check permissions on a per-competition basis
		return <div id='competitions' className='content'>
			<h1>Tävlingar</h1>
			<ul>
				{this.state.competitions.map(c => <Competition key={c.id} competition={c} token={this.getToken(c)} />)}
				{loggedIn && <li><Link to="/create">Skapa ny tävling</Link></li>}
			</ul>
		</div>;
	}
});