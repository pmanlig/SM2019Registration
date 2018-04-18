import "./Toolbar.css";
import React from 'react';
import { Components, Events } from '../logic';
import { ApplicationState } from './../ApplicationState';

function getParticipant() {
	ApplicationState.instance.showPicker = true;
	ApplicationState.instance.updateState({})
}

export function GetParticipant(props) {
	return ApplicationState.instance.registry.length > 0 && <input type='button' className="button toolButton" id="getButton" onClick={getParticipant} value='Hämta deltagare' />;
}

export function AddParticipant(props) {
	return <input type='button' className="button toolButton" id="addButton" onClick={props.onClick} value='Ny deltagare' />;
}

export function Register(props) {
	return <input type='button' className="button toolButton" id="registerButton" onClick={props.onClick} value='Registrera' />;
}

export function Toolbar(props) {
	return <div className="buttons center">
		<GetParticipant />
		<AddParticipant onClick={e => props.fire(Events.addParticipant)} />
		<Register onClick={e => props.fire(Events.register)} />

		{/* For debugging */}
		<input type='button' className="button toolButton" id="deleteCookiesButton" onClick={() => props.injector.inject(Components.Cookies).deleteCookies()} value='Radera Cookies' />
	</div>
}