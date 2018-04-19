import "./Toolbar.css";
import React from 'react';
import { Components, Events, InjectedComponent } from '../logic';

export class Toolbar extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.registryUpdated, () => this.setState({}));
	}

	render() {
		return <div className="buttons center">
			{this.inject(Components.Registry).competitors.length > 0 &&
				<input type='button' className="button toolButton" id="getButton" onClick={e => this.fire(Events.showParticipantPicker)} value='Hämta deltagare' />}
			<input type='button' className="button toolButton" id="addButton" onClick={e => this.fire(Events.addParticipant)} value='Ny deltagare' />
			<input type='button' className="button toolButton" id="registerButton" onClick={e => this.fire(Events.register)} value='Registrera' />

			{/* For debugging */}
			<input type='button' className="button toolButton" id="deleteCookiesButton" onClick={e => this.inject(Components.Cookies).deleteCookies()} value='Radera Cookies' />
		</div>
	}
}