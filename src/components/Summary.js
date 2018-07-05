import './Summary.css';
import React from 'react';
import { Components } from '.';

function countEntries(participants) {
	var entries = 0;
	participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) entries++; }) });
	return entries;
}

export function Summary(props) {
	let participants = props.inject(Components.Registration).participants;
	return (
		<div id='summary' className='center content'>
			<p>Antal deltagare: {participants.length}<br />Antal starter: {countEntries(participants)}</p>
		</div>);
}