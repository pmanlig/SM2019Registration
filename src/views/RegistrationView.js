import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Components, Events } from '.';
import { InjectedComponent } from '../logic';

export class RegistrationView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.fire(Events.changeTitle, "Anmälan till " + this.inject(Components.Competition).name);
		this.subscribe(Events.registrationUpdated, () => this.setState({}));
		this.inject(Components.Registration).load(props.match.params.id, props.match.params.token);
	}

	render() {
		const ParticipantPicker = this.inject(Components.ParticipantPicker);
		const Toolbar = this.inject(Components.Toolbar);
		const RegistrationContact = this.inject(Components.RegistrationContact);
		const RegistrationForm = this.inject(Components.RegistrationForm);
		const Summary = this.inject(Components.Summary);

		const registrationInfo = this.inject(Components.Registration);
		if (registrationInfo.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={'/competition/' + this.props.match.params.id + '/register/' + registrationInfo.token} />
		}

		return <div>
			<RegistrationContact />
			<RegistrationForm />
			<Summary />
			<Toolbar />
			<ParticipantPicker />
		</div>;
	}
}