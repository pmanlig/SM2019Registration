import React from 'react';
import "./Toolbar.css";
import { ApplicationState } from './ApplicationState';
import { deleteCookies } from './Cookies';

export function Toolbar(props) {
	const appState = ApplicationState.instance;
	return <div className="buttons center">
		{appState.registry.length > 0 && <input type='button' className="button toolButton" id="getButton" onClick={props.getParticipant} value='Hämta deltagare' />}
		<input type='button' className="button toolButton" id="addButton" onClick={e => appState.addParticipant()} value='Ny deltagare' />
		<input type='button' className="button toolButton" id="registerButton" onClick={appState.register} value='Registrera' />

		{/* For debugging */}
		<input type='button' className="button toolButton" id="deleteCookiesButton" onClick={deleteCookies} value='Radera Cookies' />
	</div>
}