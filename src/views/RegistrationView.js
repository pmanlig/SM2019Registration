import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "Toolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "SquadPicker"];

	constructor(props) {
		super(props);
		this.state = { showSchedule: undefined, currentParticipant: undefined };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.subscribe(this.Events.showSchedule, (participant, event) => this.setState({ showSchedule: event.schedule, currentParticipant: participant }));
		this.Registration.load(props.match.params.id, props.match.params.token);
	}

	componentWillMount() {
		this.fire(this.Events.changeTitle, "Anmälan till " + this.Competition.name);
	}

	render() {
		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		return <div>
			{this.state.showSchedule && <this.SquadPicker id={this.state.showSchedule} />}
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.Toolbar />
			<this.ParticipantPicker />
		</div>;
	}
}