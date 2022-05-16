import './TeamView.css';
import React from 'react';
import { Description, NewRegistrationContact, TeamForm } from '../components';
import { ParticipantScore, Team } from '../models';



export class TeamView extends React.Component {
	static register = { name: "TeamView" };
	static wire = ["EventBus", "Events", "Server", "Busy", "Competition", "Footers", "Registration", "TeamRegistration"];

	constructor(props) {
		super(props);
		this.state = { name: "", organization: "", email: "", state: "", teams: [] };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		if (props.match.params.id) {
			this.Competition.load(parseInt(props.match.params.id, 10));
			this.Server.getCompetitionParticipants(props.match.params.id,
				json => this.setState({ participants: json.map(j => ParticipantScore.fromJson(j)) }),
				this.Footers.errorHandler("Kan inte hämta deltagare!"));
		}
	}

	onChangeContact = (prop, value) => {
		this.fire(this.Events.setRegistrationInfo, prop, value);
	}

	addTeam = () => {
		let { teams } = this.state;
		this.setState({ teams: teams.concat(new Team(`Lag ${teams.length + 1}`)) });
	}

	teamDefs() {
		return this.Competition.events.flatMap(e => e.teams.map(t => { return { ...t, event: e.name } }));
	}

	render() {
		let { teams, participants } = this.state;
		let { name, organization, email, account } = this.Registration.contact;
		let teamDefs = this.teamDefs();
		// let events = teamDefs.map(t => t.event).filter((v, i, a) => a.indexOf(v) === i);
		if (participants !== undefined) { participants = participants.filter(p => p.organization === organization); }
		return <div>
			<Description value={this.Competition.description} />
			<NewRegistrationContact name={name} organization={organization} email={email} account={account} showAccount="true" onChange={this.onChangeContact} />
			<TeamForm competition={this.Competition} teamDefs={teamDefs} teams={teams} participants={participants} onDelete={idx => this.setState({ teams: this.state.teams.filter((v, i) => i !== idx) })} />
			<div className="content">
				<button className="button" onClick={e => this.addTeam()}><div className="button small green button-add" /> Lägg till lag</button>
				<input type="button" className="button" value="Anmäl lag" />
			</div>
		</div>;
	}
}