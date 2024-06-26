import './ParticipantPicker.css';
import React from 'react';
import { ModalDialog } from '../general';

export class ParticipantPicker extends React.Component {
	static register = { name: "ParticipantPicker" };
	static wire = ["Registration", "Registry", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { visible: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.showParticipantPicker, () => this.setState({ visible: true }));
	}

	deleteCompetitor = (e, id) => {
		e.stopPropagation();
		this.Registry.deleteCompetitor(id)
		this.setState({});
	}

	Competitor = (props) => {
		return <tr className="picker" onClick={props.onClick}>
			<td>{props.person.name}</td>
			<td>{props.person.competitionId}</td>
			<td>{props.person.organization}</td>
			<td><div className="pp-delete"><button className="button-close small red" onClick={e => this.deleteCompetitor(e, props.person.competitionId)} /></div></td>
		</tr>
	}

	render() {
		return !this.state.visible ? null :
			<ModalDialog title="Hämta deltagare" showClose={true} onClose={e => this.setState({ visible: false })}>
				<table className="picker">
					<thead>
						<tr className='picker'>
							<th>Namn</th>
							<th>Pistolskyttekort</th>
							<th>Förening</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this.Registry.competitors.sort((a,b) => a.name.localeCompare(b.name)).map(p =>
							<this.Competitor key={p.competitionId} person={p} onClick={e => {
								this.setState({ visible: false });
								this.Registration.addParticipant(p);
							}} />)}
					</tbody>
				</table>
			</ModalDialog>;
	};
}