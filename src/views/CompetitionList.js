import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, Status, Operations } from '../models';

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

export class CompetitionList extends React.Component {
	static register = { name: "CompetitionList" };
	static wire = ["Server", "Session", "Storage", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { competitions: initialCompetitions };
		this.EventBus.manageEvents(this);
		// ToDo: needs to handle subscribe in componentDidMount / componentWillUnmount
		this.subscribe(this.Events.userChanged, this.loadCompetitions);
		this.subscribe(this.Events.serverChanged, this.loadCompetitions);
	}

	loadCompetitions = () => {
		this.Server.loadCompetitionList(json => {
			let serverCompetitions = json.map(c => {
				// ToDo: Remove debugging code
				return { permissions: Permissions.Any, ...c, status: Status.Open };
			});
			if (this.Server.local) {
				serverCompetitions = initialCompetitions.concat(serverCompetitions);
			}
			this.setState({ competitions: serverCompetitions });
		});
	}

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Anmälningssytem Gävle PK");
		this.loadCompetitions();
	}

	getToken(c) {
		let tokens = this.Storage.get("Tokens");
		if (!tokens) { return undefined; }
		return tokens[c.id];
	}

	competition(competition) {
		let links = Operations.filter(o => (
			competition.permissions === Permissions.Own ||
			(competition.permissions >= o.permission && (o.status === undefined || o.status === competition.status))
		));
		return <li key={competition.id}>
			<Link className="competitionLink" to={`/competition/${competition.id}`}>{competition.name}</Link>
			{links.map(l =>
				<span key={l.name}>&nbsp;<Link to={`/competition/${competition.id}/${l.path}`}>{l.name}</Link>&nbsp;</span>)}
		</li>
	}

	render() {
		let loggedIn = this.Session.user !== "";
		return <div id='competitions' className='content'>
			<h1>Tävlingar{this.Server.local && " (felsökning)"}</h1>
			<ul>
				{this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own)).map(c => this.competition(c))}
				{loggedIn && <li><Link className="competitionLink" to={`/create`}>Skapa ny tävling</Link></li>}
			</ul>
		</div>;
	}
}