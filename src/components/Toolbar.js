import "./Toolbar.css";
import "./Buttons.css";
import React from 'react';
import { Components, Events, InjectedComponent } from '../logic';

export class Toolbar extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.registryUpdated, () => this.setState({}));
	}

	render() {
		let registration = this.inject(Components.Registration);
		return <div className="buttons center content">
			{this.inject(Components.Registry).competitors.length > 0 &&
				<input type='button' className="button toolButton" id="getButton" onClick={e => this.fire(Events.showParticipantPicker)} value='Hämta deltagare' />}
			<input type='button' className="button toolButton" id="addButton" onClick={e => registration.addParticipant()} value='Ny deltagare' />
			<input type='button' className="button toolButton" id="registerButton" onClick={e => this.fire(Events.registerForCompetition)} value='Registrera' />

			{/* For debugging */}
			<input type='button' className="button toolButton" id="deleteStorageButton" onClick={e => this.inject(Components.Storage).delete()} value='Radera sparad information' />
		</div>
	}
}