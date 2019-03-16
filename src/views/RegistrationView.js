import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "RegistrationToolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "SquadPicker", "Server"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.Registration.load(props.match.params.id, props.match.params.token);
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Anmälan till " + this.Competition.name);
	}

	render() {
		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		return <div>
			<this.SquadPicker />
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.RegistrationToolbar />
			<this.ParticipantPicker />
		</div>;
	}
}