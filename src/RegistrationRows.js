import React, { Component } from 'react';
import { RegistrationRow } from './RegistrationRow';

export class RegistrationRows extends Component {
	render() {
		return <tbody>{this.props.registration.participants.map(
			participant => <RegistrationRow key={participant.id} registration={this.props.registration} participant={participant} />
		)}</tbody>;
	}
}