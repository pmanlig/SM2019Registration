import React from 'react';

function Competitor(props) {
	return <tr className="picker" onClick={props.onClick}>
		<td>{props.person.name}</td>
		<td>{props.person.competitionId}</td>
		<td>{props.person.organization}</td>
	</tr>
}

export function ParticipantPicker(props) {
	return <div>
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
					{props.registry.map(p => <Competitor key={p.competitionId} person={p} onClick={e => props.onClick(p)} />)}
				</tbody>
			</table>
		</div>
	</div>;
}