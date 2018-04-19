import './Summary.css';
import React from 'react';

function countEntries(participants) {
	var entries = 0;
	participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) entries++; }) });
	return entries;
}

export function Summary(props) {
	return (
		<div id='summary' className='center'>
			<p>Antal deltagare: {props.participants.length}<br />Antal starter: {countEntries(props.participants)}</p>
		</div>);
}