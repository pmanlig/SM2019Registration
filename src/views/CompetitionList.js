import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, Status, Operations } from '../models';

export class CompetitionList extends React.Component {
	static register = { name: "CompetitionList" };
	static wire = ["Server", "Session", "Storage", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { competitions: [] };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.userChanged, this.loadCompetitions);
		this.subscribe(this.Events.serverChanged, this.loadCompetitions);
	}

	loadCompetitions = () => {
		this.Server.loadCompetitionList(json => this.setState({ competitions: json }));
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
			<div className="event-title">
				<Link className="competition-link" to={`/competition/${competition.id}`}>{competition.name}</Link>
				{competition.permissions === Permissions.Own && <button className="button-close small red"
					onClick={e => this.Server.deleteCompetition(competition.id, this.loadCompetitions)} />}
			</div>
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