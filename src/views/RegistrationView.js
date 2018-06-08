import React from 'react';
import { Redirect } from 'react-router-dom';
import { Components, Events } from '.';
import { InjectedComponent } from '../logic';

export class RegistrationView extends InjectedComponent {
	constructor(props) {
		super(props);
		let state = this.inject(Components.CompetitionState);
		this.subscribe(Events.registrationUpdated, () => this.setState({}));
		this.fire(Events.changeTitle, "Anmälan till " + state.competition.name);
		state.loadRegistration(props.match.params.id, props.match.params.token);
	}

	render() {
		// ToDo: rewrite to make this unnecessary
		/*
		if (this.state.token !== undefined && this.state.token !== this.props.match.params.token) {
			return <Redirect to={'/competition/' + this.props.match.params.id + '/' + this.state.token} />
		}
		*/

		const state = this.inject(Components.CompetitionState);
		const registrationInfo = state.registration;
		const ParticipantPicker = this.inject(Components.ParticipantPicker);
		const Toolbar = this.inject(Components.Toolbar);
		const RegistrationContact = this.inject(Components.RegistrationContact);
		const RegistrationForm = this.inject(Components.RegistrationForm);
		const Summary = this.inject(Components.Summary);
		let id = 0;
		return [
			<RegistrationContact key={id++} />,
			<Toolbar key={id++} />,
			<RegistrationForm key={id++} info={registrationInfo.competition} participants={registrationInfo.participants} />,
			<Summary key={id++} participants={registrationInfo.participants} />,
			<ParticipantPicker key={id++} />
		];
	}
}