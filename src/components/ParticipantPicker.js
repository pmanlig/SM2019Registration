import React from 'react';
import { Components, Events, InjectedComponent } from '.';

function Competitor(props) {
	return <tr className="picker" onClick={props.onClick}>
		<td>{props.person.name}</td>
		<td>{props.person.competitionId}</td>
		<td>{props.person.organization}</td>
	</tr>
}

export class ParticipantPicker extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { visible: false };
		this.subscribe(Events.showParticipantPicker, () => this.setState({ visible: true }));
	}

	render() {
		return !this.state.visible ? null : <div>
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
						{this.inject(Components.Registry).competitors.map(p =>
							<Competitor key={p.competitionId} person={p} onClick={e => {
								this.setState({ visible: false });
								this.fire(Events.addParticipant, p);
							}} />)}
					</tbody>
				</table>
			</div>
		</div>;
	};
}