import "./CompetitionList.css";
import gpk from './../gpk_logo_wht.png';
import xkretsen from './../gavleborg.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, Status, Operations } from '../models';

export class CompetitionList extends React.Component {
	static register = { name: "CompetitionList" };
	static wire = ["Server", "Session", "Storage", "EventBus", "Events", "Footers", "YesNoDialog"];

	constructor(props) {
		super(props);
		this.state = { competitions: [], groups: [] };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.userChanged, this.loadCompetitions);
		this.subscribe(this.Events.serverChanged, this.loadCompetitions);
		this.icons = { GPK: gpk, XKRETSEN: xkretsen }
	}

	loadCompetitions = () => {
		this.Server.loadCompetitionGroups(groups => {
			this.Server.loadCompetitionList(json => this.setState({
				competitions: json.map(c => {
					if (c.name.includes("$")) {
						let parts = c.name.split("$");
						if (parts.length > 2) {
							c.group = parts[0];
							c.name = parts[1];
							c.subtitle = parts[2];
						} else {
							c.group = c.group || "";
							c.name = parts[0];
							c.subtitle = parts[1];
						}
					}
					return {
						...c,
						status: c.status ? parseInt(c.status.toString(), 10) : Status.Open,
						permissions: c.permissions ? parseInt(c.permissions.toString(), 10) :
							(this.Session.user === "" ? Permissions.Any : Permissions.Own)
					}
				}),
				groups: groups
			}), this.Footers.errorHandler("Kan inte hämta tävlingar"));
		}, this.Footers.errorHandler("Kan inte hämta grupper"));
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
			competition.permissions !== Permissions.Any ||
			(o.permission === Permissions.Any && (o.status === undefined || o.status === competition.status))
		));
		return <div key={competition.id} className={"competition-tile " + (competition.status === Status.Hidden ? "hidden" : (competition.status === Status.Closed ? "closed" : "open"))}>
			<div className="event-title">
				<Link className="competition-link" to={`/competition/${competition.id}`}>{competition.name.split("$")[0]}</Link>
				{competition.permissions === Permissions.Own && <button className="button-close small red"
					onClick={e => this.setState({ deleteCompetition: competition })} />}
			</div>
			{competition.subtitle !== "" && <div className="subtitle">{competition.subtitle}</div>}
			{links.map(l =>
				<span key={l.name}>&nbsp;<Link to={`/competition/${competition.id}/${l.path}`}>{l.name}</Link>&nbsp;</span>)}
		</div>
	}

	Group = ({ group }) => {
		return <div className="competition-tile open competition-group">
			<div style={{ width: "40px" }}>
				{group.icon && <img src={this.icons[group.icon]} className="group-icon" alt={group.icon} />}
			</div>
			<div className="group-text">
				<div className="event-title">
					<Link className="competition-link" to={`/group/${group.label}`}>{group.name}</Link>
				</div>
				<div className="subtitle">{group.description}</div>
			</div>
		</div>;
	}

	Groups = ({ group_id }) => {
		if (group_id === undefined || group_id === "")
			return this.state.groups.map(g => <this.Group key={g.label} group={g} />);
		return null;
	}

	groupName(group_id) {
		if (group_id === undefined || this.state.groups === undefined) return "";
		let group = this.state.groups.find(g => g.label === group_id);
		return group ? " " + group.name : "";
	}

	Competitions = ({ competitions, loggedIn }) => {
		if (competitions.length === 0 && !loggedIn) return <p>Inga tävlingar att visa - logga in för att skapa en tävling</p>;
		return competitions.map(c => <this.Competition key={c.id} competition={c} />);
	}

	CreateCompetition = props => {
		if (this.Session.user === "") return null;
		return <div className="create-competition competition-tile"><Link className="competition-link" to={`/create`}>Skapa ny tävling</Link></div>;
	}

	DeleteCompetitionDialog = () => {
		if (!this.state.deleteCompetition) return null;
		return <this.YesNoDialog title="Bekräfta borttagning"
			text={`Är du säker på att du vill ta bort ${this.state.deleteCompetition.name}?`} action={act => this.deleteCompetition(act)} />;

	}

	render() {
		let group_id = this.props.match.params.group_id;
		// ToDo: fix filtering of hidden competitions in server
		let competitions = this.state.competitions.filter(h => (h.status !== Status.Hidden || h.permissions === Permissions.Own));
		if (group_id) {
			competitions = competitions.filter(c => c.group === group_id);
		} else {
			competitions = competitions.filter(c => c.group === undefined || c.group === "");
		}
		return <div id='competitions' className='content'>
			<this.DeleteCompetitionDialog />
			<h1>Tävlingar{this.groupName(group_id)}{this.Server.local && " (felsökning)"}</h1>
			<div className={competitions.length > 10 ? 'competition-list-compact' : 'competition-list'}>
				<this.Groups group_id={group_id} />
				<this.Competitions competitions={competitions} />
				<this.CreateCompetition />
			</div>
		</div>;
	}
}