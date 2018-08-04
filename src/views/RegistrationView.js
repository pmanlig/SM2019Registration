import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { InjectedComponent } from '../logic';

export class RegistrationView extends InjectedComponent {
	static register = true;
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "Toolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "Schedule"];

	constructor(props) {
		super(props);
		this.state = { showSchedule: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.subscribe(this.Events.showSchedule, () => this.setState({ showSchedule: true }));
		this.Registration.load(props.match.params.id, props.match.params.token);
	}

	componentWillMount() {
		this.fire(this.Events.changeTitle, "Anmälan till " + this.Competition.name);
	}

	render() {
		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={'/competition/' + this.props.match.params.id + '/register/' + this.Registration.token} />
		}

		return <div>
			{this.state.showSchedule && <this.Schedule />}
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.Toolbar />
			<this.ParticipantPicker />
		</div>;
	}
}