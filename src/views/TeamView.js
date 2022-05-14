import './TeamView.css';
import React from 'react';
import { Description, NewRegistrationContact, TeamForm } from '../components';
import { ParticipantScore, Team } from '../models';



export class TeamView extends React.Component {
	static register = { name: "TeamView" };
	static wire = ["EventBus", "Events", "Server", "Busy", "Competition", "Footers", "TeamRegistration"];

	constructor(props) {
		super(props);
		this.state = { name: "", organization: "", email: "", state: "", teams: [] };
		this.EventBus.manageEvents(this);
		if (props.match.params.id) {
			this.Competition.load(parseInt(props.match.params.id, 10));
			this.Server.getCompetitionParticipants(props.match.params.id,
				json => this.setState({ participants: json.map(j => ParticipantScore.fromJson(j)) }),
				this.Footers.errorHandler("Kan inte hämta deltagare!"));
		}
	}

	onChange = (prop, value) => {
		switch (prop) {
			case "name":
				this.setState({ name: value });
				break;
			case "organization":
				this.setState({ organization: value });
				break;
			case "email":
				this.setState({ email: value });
				break;
			case "account":
				this.setState({ account: value });
				break;
			default:
				break;
		}
	}

	addTeam = () => {
		let { teams } = this.state;
		this.setState({ teams: teams.concat(new Team(`Lag ${teams.length + 1}`)) });
	}

	teamDefs() {
		return this.Competition.events.flatMap(e => e.teams.map(t => { return { ...t, event: e.name } }));
	}

	render() {
		let teamDefs = this.teamDefs();
		// let events = teamDefs.map(t => t.event).filter((v, i, a) => a.indexOf(v) === i);
		let { name, organization, email, account, teams, participants } = this.state;
		if (participants !== undefined) { participants = participants.filter(p => p.organization === organization); }
		return <div>
			<Description value={this.Competition.description} />
			<NewRegistrationContact name={name} organization={organization} email={email} account={account} showAccount="true" onChange={this.onChange} />
			<TeamForm competition={this.Competition} teamDefs={teamDefs} teams={teams} participants={participants} onDelete={idx => this.setState({ teams: this.state.teams.filter((v, i) => i !== idx) })} />
			<div className="content">
				<button className="button" onClick={e => this.addTeam()}><div className="button small green button-add" /> Lägg till lag</button>
				<input type="button" className="button" value="Anmäl lag" />
			</div>
		</div>;
	}
}