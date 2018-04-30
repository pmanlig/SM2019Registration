import React from 'react';
import { Events } from '.';

const personHeader = {
	name: 'Skytt', subFields: [
		{ name: 'Namn', field: 'name', width: 200, type: 'text' },
		{ name: 'Pistolskyttekort', field: 'competitionId', size: '5', placeholder: '00000', width: 40, type: 'number' },
		{ name: 'Förening', field: 'organization', width: 200, type: 'text' }]
};

function RegistrationHeader(props) {
	let counter = 0;
	const compInfo = props.info;
	const majorHeaders = [<th key="-1" className="major" colSpan={personHeader.subFields.length}>{personHeader.name}</th>];
	const minorHeaders = [];

	personHeader.subFields.forEach(s => {
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
		result.push(<td key={i}><input type="checkbox" className="checkbox" onChange={(e) =>
			props.fire(Events.setParticipantDivision, props.participant.id, i, e.target.checked)
		} checked={info[i]} /></td>);
	}
	return result;
}

function RegistrationField({ id, participant, header, fire }) {
	return <td className="left" key={header.name}><input type="text" value={participant[header.field]}
		placeholder={header.placeholder || header.name} style={{ width: header.width }}
		onChange={e => fire(Events.setParticipantField, id, header.field, e.target.value)}
		size={header.size} /></td>;
}

function RegistrationRow(props) {
	const p = props.participant;
	const myId = p.id;
	return <tr key={myId} style={{ background: props.participant.errors.length > 0 ? "red" : "white" }}>
		{personHeader.subFields.map(h => <RegistrationField key={h.field} id={myId} participant={p} header={h} {...props} />)}
		{RegistrationCheckboxes(props)}
		<td><button className="deleteButton button" onClick={e => props.fire(Events.deleteParticipant, myId)}>x</button></td></tr>;
}

function RegistrationRows(props) {
	return <tbody>{props.participants.map(
		p => <RegistrationRow key={p.id} participant={p} {...props} />
	)}</tbody>;
}

export function RegistrationForm(props) {
	return <div id='registration' className='content'>
		<table>
			<RegistrationHeader {...props} />
			<RegistrationRows {...props} />
		</table>
	</div>;
}