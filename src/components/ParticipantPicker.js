import React from 'react';
import { ApplicationState } from '../ApplicationState';

function getParticipant(p) {
	let f = x => { return x.competitionId === p.competitionId; };
	if (p !== undefined && ApplicationState.instance.registration.find(f) !== undefined) {
		this.addFooter("Deltagaren finns redan!");
	} else {
		ApplicationState.instance.addParticipant(p);
	}
	ApplicationState.instance.showPicker = false;
	ApplicationState.instance.updateState({});
}

function Competitor(props) {
	return <tr className="picker" onClick={props.onClick}>
		<td>{props.person.name}</td>
		<td>{props.person.competitionId}</td>
		<td>{props.person.organization}</td>
	</tr>
}

export function ParticipantPicker(props) {
	const registry = ApplicationState.instance.registry;
	return ApplicationState.instance.showPicker === true && <div>
		<div className="fullscreen shadow" />
		<div id="participantpicker" className="centered modal">
			<h1>Hämta deltagare</h1>
			<table className="picker">
				<thead>
					<tr>
						<th>Namn</th>
						<th>Pistolskyttekort</th>
						<th>Förening</th>
					</tr>
				</thead>
				<tbody>
					{registry.map(p => <Competitor key={p.competitionId} person={p} onClick={e => getParticipant(p)} />)}
				</tbody>
			</table>
		</div>
	</div>;
}