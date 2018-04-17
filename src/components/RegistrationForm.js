import React from 'react';
import { ApplicationState } from '../ApplicationState';
import { PersonDefinition } from '../models';

function RegistrationHeader(props) {
	let counter = 0;
	const compInfo = props.info;
	const personHeader = PersonDefinition.getHeaders();
	const majorHeaders = [<th key="-1" className="major" colSpan={personHeader.subfields.length}>{personHeader.name}</th>];
	const minorHeaders = [];

	personHeader.subfields.forEach(s => {
		minorHeaders.push(<th key={counter++} style={{ width: s.width, paddingRight: 10, verticalAlign: "bottom" }} className="minor">{s.name}</th>);
	});

	compInfo.eventGroups.forEach(column => {
		majorHeaders.push(<th key={column.id} className="major" colSpan={column.events.length}>{column.name}</th>);
		column.events.forEach(event => {
			minorHeaders.push(<th key={counter++} className="minor vert"><div>{compInfo.event(event).name}</div></th>);
		});
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
		result.push(<td key={i}><input type="checkbox" className="checkbox" onChange={(e) => {
			ApplicationState.instance.setDivision(props.participant.id, i, e.target.checked)
		}} checked={info[i]} /></td>);
	}
	return result;
}

function RegistrationRow(props) {
	const myId = props.participant.id;
	return <tr key={myId} style={{ background: props.participant.error ? "red" : "white" }}>
		<td className="left"><input type="text" value={props.participant.name} placeholder="Namn"
			onChange={e => { /*appState.setParticipantName(myId, e.target.value)*/ }} /></td>
		<td className="left"><input type="text" size="5" style={{ width: '40px' }} value={props.participant.competitionId} placeholder="00000"
			onChange={e => { /*appState.setParticipantCompetitionId(myId, e.target.value)*/ }} /></td>
		<td className="left"><input type="text" value={props.participant.organization} placeholder="Förening"
			onChange={e => { /*appState.setParticipantOrganization(myId, e.target.value)*/ }} /></td>
		{RegistrationCheckboxes(props)}
		<td><button className="deleteButton button" onClick={(e) => {} /*appState.deleteParticipant(myId)*/}>x</button></td></tr>;
}

function RegistrationRows(props) {
	console.log(props.participants);
	return <tbody>{props.participants.map(
		p => <RegistrationRow key={p.id} participant={p} />
	)}</tbody>;
}

export function RegistrationForm(props) {
	return <div id='registration' className='registration'>
		<table>
			<RegistrationHeader info={props.info} />
			<RegistrationRows info={props.info} participants={props.participants}/>
		</table>
	</div>;
}