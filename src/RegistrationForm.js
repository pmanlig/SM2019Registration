import React from 'react';
import { ApplicationState } from './ApplicationState';
import { ParticipantDefinition } from './Participant';

function RegistrationHeader(props) {
	const majorHeaders = [];
	const minorHeaders = [];
	var first = true;
	var counter = 0;
	props.columns.forEach((column) => {
		majorHeaders.push(<th key={majorHeaders.length} className="major" colSpan={column.subfields.length}>{column.name}</th>);
		column.subfields.forEach((minor) => {
			if (first)
				minorHeaders.push(<th key={counter++} style={{ width: minor.width, paddingRight: 10 }} className="minor">{minor.name}</th>);
			else
				minorHeaders.push(<th key={counter++} className="minor vert"><div>{minor.name}</div></th>);
		});
		first = false;
	});
	return (
		<thead>
			<tr>{majorHeaders}</tr>
			<tr>{minorHeaders}</tr>
		</thead>
	);
}

function RegistrationCheckboxes(props) {
	let info = props.participant.registrationInfo;
	let result = [];
	for (let i = 0; i < info.length; i++) {
		result.push(<td key={i}><input type="checkbox" onChange={(e) => { props.appState.setDivision(props.participant.id, i, e.target.checked) }} checked={info[i]} /></td>);
	}
	return result;
}

function RegistrationRow(props) {
	const myId = props.participant.id;
	return <tr key={myId}>
		<td className="left"><input type="text" value={props.participant.name} placeholder="Namn"
			onChange={e => { props.appState.setParticipantName(myId, e.target.value) }} /></td>
		<td className="left"><input type="text" size="5" style={{ width: '40px' }} value={props.participant.competitionId} placeholder="00000"
			onChange={e => { props.appState.setParticipantCompetitionId(myId, e.target.value) }} /></td>
		<td className="left"><input type="text" value={props.participant.organization} placeholder="Förening"
			onChange={e => { props.appState.setParticipantOrganization(myId, e.target.value) }} /></td>
		{RegistrationCheckboxes(props)}
		<td><button className="deleteButton button" onClick={(e) => props.appState.deleteParticipant(props.participant.id)}>X</button></td></tr>;
}

function RegistrationRows(props) {
	return <tbody>{props.appState.registration.map(
		participant => <RegistrationRow key={participant.id} columns={props.columns} appState={props.appState} participant={participant} />
	)}</tbody>;
}

export function RegistrationForm(props) {
	let appState = ApplicationState.instance;
	return <div id='registration'>
		<table>
			<RegistrationHeader columns={ParticipantDefinition.getHeaders()} />
			<RegistrationRows columns={ParticipantDefinition.getHeaders()} appState={appState} />
		</table>
	</div>;
}