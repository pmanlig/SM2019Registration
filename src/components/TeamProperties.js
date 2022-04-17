import './TeamProperties.css';
import React from 'react';
import { ModalDialog } from '../general';

export class TeamProperties extends React.Component {
	static register = { name: "TeamProperties" };
	static wire = ["EventBus", "Events", "Competition"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.editTeams, e => this.setState({ event: e }));
		this.state = {};
	}

	onClose = () => {
		this.setState({ event: undefined })
	}

	render() {
		if (this.state.event === undefined) { return null; }
		return <ModalDialog title="Lag" onClose={this.onClose} showClose="true">
			<div className="team-definitions">
				<div>Deltagare</div>
				<div>Reserver</div>
				<div>Vapengrupp</div>
				<div>Klass</div>
				<div>Lägg till</div>
			</div>
			<div className="modal-buttons">
				<button className="button" onClick={this.onClose}>OK</button>
			</div>
		</ModalDialog>;
	}
}