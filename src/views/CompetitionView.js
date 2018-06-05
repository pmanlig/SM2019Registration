import React from 'react';
import { Redirect } from 'react-router-dom';
import { CompetitionTabs } from '../components';
import { InjectedComponent } from '../logic';
import { Components, Events } from '.';

export class CompetitionView extends InjectedComponent {
	constructor(props) {
		super(props);
		// this.subscribe(Events.registrationUpdated, r => this.setState({}));
		this.inject(Components.Registration).loadCompetition(props.match.params.id, props.match.params.token);
	}

	render() {
		if (this.props.match.params.operation === "register") {
			const RegistrationView = this.inject(Components.RegistrationView);
			return <div><CompetitionTabs {...this.props} /><RegistrationView {...this.props} /></div>;
		}
		return <Redirect to='/' />;
	}
}