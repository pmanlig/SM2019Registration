import './TeamView.css';
import React from 'react';
import { Description, NewRegistrationContact, TeamForm } from '../components';
import { Permissions, Status, ParticipantScore, Team, TabInfo } from '../models';

export class TeamView extends React.Component {
	static register = { name: "TeamView" };
	static wire = ["EventBus", "Events", "Server", "Busy", "Competition", "Footers", "Registration", "TeamRegistration"];
	static tabInfo = new TabInfo("Laganmälan", "teams", 2, Permissions.Admin, Status.Open);

	constructor(props) {
		super(props);
		this.state = { teams: [], teamDefs: this.teamDefs() };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, this.onRegistrationUpdated);
		let { id, token } = props.match.params;
		if (id) {
			this.Competition.load(parseInt(id, 10));
			this.Server.getCompetitionParticipants(id,
				json => this.setState({ participants: json.map(j => ParticipantScore.fromJson(j)) }),
				this.Footers.errorHandler("Kan inte hämta deltagare!"));
			if (token) { this.Registration.load(id, token); }
		}
	}

	onRegistrationUpdated = () => {
		let { teamDefs } = this.state;
		this.Registration.teams.forEach(team => {
			teamDefs.forEach((def, index) => {
				if (def.eventId === team.event && def.index === team.index) {
					team.teamDef = index.toString();
				}
			});
		});
		this.setState({});
	}

	onChangeContact = (prop, value) => {
		this.fire(this.Events.setRegistrationInfo, prop, value);
	}

	addTeam = () => {
		let { teamDefs } = this.state;
		this.Registration.teams.push(new Team(`Lag ${this.Registration.teams.length + 1}`, teamDefs[0].eventId, teamDefs[0].index));
		this.setState({});
	}

	deleteTeam = idx => {
		this.Registration.teams = this.Registration.teams.filter((v, i) => i !== idx);
		this.setState({})
	}

	teamDefs() {
		return this.Competition.events.flatMap(e => e.teams.map((t, i) => { return { ...t, event: e.name, eventId: e.id, index: i } }));
	}

	render() {
		let { participants, teamDefs } = this.state;
		let { name, organization, email, account } = this.Registration.contact;
		if (participants !== undefined) { participants = participants.filter(p => p.organization === organization); }
		return <div>
			<Description value={this.Competition.description} />
			<NewRegistrationContact name={name} organization={organization} email={email} account={account} showAccount="true" onChange={this.onChangeContact} />
			<TeamForm competition={this.Competition} teamDefs={teamDefs} teams={this.Registration.teams} participants={participants} onDelete={idx => this.deleteTeam(idx)} />
			<div className="content">
				<button className="button" onClick={this.addTeam}><div className="button small green button-add" /> Lägg till lag</button>
				<input type="button" className="button" value="Anmäl lag" onClick={() => this.Registration.registerTeams()} />
			</div>
		</div>;
	}
}