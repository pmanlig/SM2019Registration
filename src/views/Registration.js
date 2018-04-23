import React from 'react';
import { Components, Events } from '.';
import { InjectedComponent } from '../logic';
import { CompetitionInfo, Person } from '../models';

export class Registration extends InjectedComponent {

	/*** Initialization & Liftcycle ***************************************************************************************/

	constructor(props) {
		super(props);
		this.state = { info: new CompetitionInfo(props.match.params.id, "", ""), participants: [], registrationContact: new Person() }; // Remove
		this.fire(Events.changeTitle, "Anmälan till " + this.state.info.description); // Remove
		this.subscribe(Events.registrationUpdated, () => this.setState({}));
		this.inject(Components.RegistrationInfo).loadCompetition(props.match.params.id);
	}

	/*** render() ***************************************************************************************/

	render() {
		const registrationInfo = this.inject(Components.RegistrationInfo);
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