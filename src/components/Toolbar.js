import "./Toolbar.css";
import "./Buttons.css";
import React from 'react';
import { Events, InjectedComponent } from '../logic';

export class Toolbar extends InjectedComponent {
	static wire = ["Registration", "Registry", "Storage"];

	constructor(props) {
		super(props);
		this.subscribe(Events.registryUpdated, () => this.setState({}));
	}

	render() {
		return <div className="buttons center content">
			{this.Registry.competitors.length > 0 &&
				<input type='button' className="button toolButton" id="getButton" onClick={e => this.fire(Events.showParticipantPicker)} value='Hämta deltagare' />}
			<input type='button' className="button toolButton" id="addButton" onClick={e => this.Registration.addParticipant()} value='Ny deltagare' />
			<input type='button' className="button toolButton" id="registerButton" onClick={e => this.fire(Events.registerForCompetition)} value='Registrera' />

			{/* For debugging */}
			<input type='button' className="button toolButton" id="deleteStorageButton" onClick={e => this.Storage.delete()} value='Radera sparad information' />
		</div>
	}
}