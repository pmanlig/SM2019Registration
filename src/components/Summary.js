import './Summary.css';
import React from 'react';

export class Summary extends React.Component {
	static register = true;
	static wire = ["Registration"];

	countEntries(participants) {
		var entries = 0;
		participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) entries++; }) });
		return entries;
	}

	render() {
		let participants = this.Registration.participants;
		return (
			<div id='summary' className='center content'>
				<p>Antal deltagare: {participants.length}<br />Antal starter: {this.countEntries(participants)}</p>
			</div>);
	}
}