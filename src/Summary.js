import React, { Component } from 'react';

export class Summary extends Component {
	render() {
		return (
			<div id='summary'>
				<p>Antal anmälda: {this.props.registration.participants.length}</p>
			</div>);
	}
}