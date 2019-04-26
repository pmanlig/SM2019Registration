import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, Status, Operations } from '../models';

export class CompetitionList extends React.Component {
	static register = { name: "CompetitionList" };
	static wire = ["Server", "Session", "Storage", "EventBus", "Events", "Footers", "YesNoDialog"];

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
		}), this.Footers.errorHandler("Kan inte hämta tävlingar"));
	}

	deleteCompetition = (act) => {
		if (act) {
			this.Server.deleteCompetition(this.state.deleteCompetition.id, this.loadCompetitions, this.Footers.errorHandler("Kan inte ta bort tävling"));
		}
		this.setState({ deleteCompetition: undefined });
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

	Competition = ({ competition }) => {
		let links = Operations.filter(o => (
			competition.permissions === Permissions.Own ||
			(competition.permissions >= o.permission && (o.status === undefined || o.status === competition.status))
		));
		let subtitle = "";
		if (competition.name.includes("$")) {
			let parts = competition.name.split("$");
			competition.name = parts[0];
			subtitle = parts[1];
		}
		return <div key={competition.id} className={"competition-tile " + (competition.status === Status.Hidden ? "hidden" : (competition.status === Status.Closed ? "closed" : "open"))}>
			<div className="event-title">
				<Link className="competition-link" to={`/competition/${competition.id}`}>{competition.name.split("$")[0]}</Link>
				{competition.permissions === Permissions.Own && <button className="button-close small red"
					onClick={e => this.setState({ deleteCompetition: competition })} />}
			</div>
			{subtitle !== "" && <div className="subtitle">{subtitle}</div>}
			{links.map(l =>
				<span key={l.name}>&nbsp;<Link to={`/competition/${competition.id}/${l.path}`}>{l.name}</Link>&nbsp;</span>)}
		</div>
	}

	render() {
		let loggedIn = this.Session.user !== "";
		// ToDo: fix filtering of hidden competitions in server
		let competitions = this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own));
		return <div id='competitions' className='content'>
			{this.state.deleteCompetition && <this.YesNoDialog title="Bekräfta borttagning"
				text={`Är du säker på att du vill ta bort ${this.state.deleteCompetition.name}?`} action={act => this.deleteCompetition(act)} />}
			<h1>Tävlingar{this.Server.local && " (felsökning)"}</h1>
			<div className={competitions.length > 10 ? 'competition-list-compact' : 'competition-list'}>
				{competitions.map(c => <this.Competition key={c.id} competition={c} />)}
				{competitions.length === 0 && !loggedIn && <p>Inga tävlingar att visa - logga in för att skapa en tävling</p>}
			</div>
			{loggedIn && <div className="create-competition competition-tile"><Link className="competition-link" to={`/create`}>Skapa ny tävling</Link></div>}
		</div>;
	}
}