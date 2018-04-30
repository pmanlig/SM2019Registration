import React from 'react';
import { Redirect } from 'react-router-dom';
import { Components, Events } from '.';
import { InjectedComponent } from '../logic';

export class RegistrationView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { token: props.match.params.token };
		this.inject(Components.Registration).loadCompetition(props.match.params.id, props.match.params.token);
		this.subscribe(Events.registrationUpdated, r => this.setState({ token: r.competition.token }));
	}

	render() {
		if (this.state.token !== undefined && this.state.token !== this.props.match.params.token) {
			return <Redirect to={'/competition/' + this.props.match.params.id + '/' + this.state.token} />
		}

		const registrationInfo = this.inject(Components.Registration);
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