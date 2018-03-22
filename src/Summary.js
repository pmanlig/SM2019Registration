import React from 'react';

function countEntries(participants) {
	var entries = 0;
	participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) entries++; }) });
	return entries;
}

export function Summary(props) {
	return (
		<div id='summary'>
			<p>Antal anmälda: {props.registration.participants.length}<br/>Antal starter: {countEntries(props.registration.participants)}</p>
		</div>);
}