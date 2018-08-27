import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "Toolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "SquadPicker", "Server"];

	constructor(props) {
		super(props);
		this.state = { schedule: undefined };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.subscribe(this.Events.showSchedule, this.showSchedule);
		this.Registration.load(props.match.params.id, props.match.params.token);
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Anmälan till " + this.Competition.name);
	}

	showSchedule = (participant, event, round) => {
		this.Server.loadSchedule(event.schedule, json => {
			this.setState({ event: event, schedule: json, participant: participant, round: round });
		});
	}

	selectSquad = (squad) => {
		// this.state.participant.addSquad(this.state.event, squad, this.state.round);
		this.setState({ schedule: undefined });
	}

	render() {
		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		return <div>
			{this.state.schedule && <this.SquadPicker schedule={this.state.schedule} onSelect={this.selectSquad} />}
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.Toolbar />
			<this.ParticipantPicker />
		</div>;
	}
}