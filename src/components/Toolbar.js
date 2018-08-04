import "./Buttons.css";
import "./Toolbar.css";
import React from 'react';

export class Toolbar extends React.Component {
	static register = true;
	static wire = ["subscribe", "fire", "Registration", "Registry", "Storage", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registryUpdated, () => this.setState({}));
	}

	render() {
		return <div className="buttons center content">
			{this.Registry.competitors.length > 0 &&
				<input type='button' className="button toolButton" id="getButton" onClick={e => this.fire(this.Events.showParticipantPicker)} value='Hämta deltagare' />}
			<input type='button' className="button toolButton" id="addButton" onClick={e => this.Registration.addParticipant()} value='Ny deltagare' />
			<input type='button' className="button toolButton" id="registerButton" onClick={e => this.fire(this.Events.registerForCompetition)} value='Registrera' />

			{/* For debugging */}
			<input type='button' className="button toolButton" id="deleteStorageButton" onClick={e => this.Storage.delete()} value='Radera sparad information' />
		</div>
	}
}