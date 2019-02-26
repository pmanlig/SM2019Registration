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
		this.Server.loadCompetitionList(json => this.setState({
			competitions: json.map(c => {
				return {
					...c,
					status: c.status ? parseInt(c.status.toString(), 10) : Status.Open,
					permissions: c.permissions ? parseInt(c.permissions.toString(), 10) :
						(this.Session.user === "" ? Permissions.Any : Permissions.Own)
				}
			})
		}));
	}

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Anmälningssystem Gävle PK");
		this.loadCompetitions(); // Needs to be done here to avoid calling setState before the component is mounted when using local code/storage
	}

	getToken(c) {
		let tokens = this.Storage.get("Tokens");
		if (!tokens) { return undefined; }
		return tokens[c.id];
	}

	competition = ({ competition }) => {
		console.log(competition);
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
		// ToDo: fix filtering of hidden competitions in server
		let competitions = this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own));
		return <div id='competitions' className='content'>
			<h1>Tävlingar{this.Server.local && " (felsökning)"}</h1>
			<ul>
				{competitions.map(c => <this.competition key={c.id} competition={c} />)}
				{loggedIn && <li><Link className="competition-link" to={`/create`}>Skapa ny tävling</Link></li>}
				{competitions.length === 0 && !loggedIn && <p>Inga tävlingar att visa - logga in för att skapa en tävling</p>}
			</ul>
		</div>;
	}
}