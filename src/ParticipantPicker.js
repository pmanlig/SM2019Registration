import React from 'react';

function Competitor(props) {
	return <tr onClick={props.onClick}>
		<td>{props.person.name}</td>
		<td>{props.person.id}</td>
		<td>{props.person.organization}</td>
	</tr>
}

export function ParticipantPicker(props) {
	return <div className="fullscreen modal">
		<div id="participantpicker" className="centered" onClick={() => { alert("clicked"); }}>
			<table>
				<tbody>
					{props.registry.forEach(p => <Competitor person={p} onClick={e => props.onClick(p)}/>)}
				</tbody>
			</table>
		</div>
	</div>;
}