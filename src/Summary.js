import React from 'react';
import { ApplicationState } from './ApplicationState';
import './Summary.css';

function countEntries(participants) {
	var entries = 0;
	participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) entries++; }) });
	return entries;
}

export function Summary(props) {
	let appState = ApplicationState.instance;
	return (
		<div id='summary' className='center'>
			<p>Antal anmälda: {appState.registration.length}<br />Antal starter: {countEntries(appState.registration)}</p>
		</div>);
}