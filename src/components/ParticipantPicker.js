import './ParticipantPicker.css';
import React from 'react';
import { ModalDialog } from './Modal';

export class ParticipantPicker extends React.Component {
	static register = true;
	static wire = ["subscribe", "Registration", "Registry", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { visible: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.showParticipantPicker, () => this.setState({ visible: true }));
	}

	Competitor(props) {
		return <tr className="picker" onClick={props.onClick}>
			<td>{props.person.name}</td>
			<td>{props.person.competitionId}</td>
			<td>{props.person.organization}</td>
		</tr>
	}

	/*
			<div className="fullscreen shadow" />
			<div id="participantpicker" className="centered modal">
				<input id='closePicker' type='button' className='round' value='X' onClick={e => this.setState({ visible: false })} />
				<h1>
					Hämta deltagare
				</h1>
				<div>
			</div>
		</div >;
	*/

	render() {
		return !this.state.visible ? null :
			<ModalDialog title="Hämta deltagare" onClose={e => this.setState({ visible: false })}>
				<table className="picker">
					<thead>
						<tr className='picker'>
							<th>Namn</th>
							<th>Pistolskyttekort</th>
							<th>Förening</th>
						</tr>
					</thead>
					<tbody>
						{this.Registry.competitors.map(p =>
							<this.Competitor key={p.competitionId} person={p} onClick={e => {
								this.setState({ visible: false });
								this.Registration.addParticipant(p);
							}} />)}
					</tbody>
				</table>
			</ModalDialog>;
	};
}