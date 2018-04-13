import "./Toolbar.css";
import React from 'react';
import { AppInjector } from '../AppInjector';
import { ApplicationState } from './../ApplicationState';

function getParticipant() {
	ApplicationState.instance.showPicker = true;
	ApplicationState.instance.updateState({})
}

function addParticipant() {
	// important to call with no parameters!
	ApplicationState.instance.addParticipant();
}

export function GetParticipant(props) {
	return ApplicationState.instance.registry.length > 0 && <input type='button' className="button toolButton" id="getButton" onClick={getParticipant} value='Hämta deltagare' />;
}

export function AddParticipant(props) {
	return <input type='button' className="button toolButton" id="addButton" onClick={addParticipant} value='Ny deltagare' />;
}

export function Register(props) {
	return <input type='button' className="button toolButton" id="registerButton" onClick={ApplicationState.instance.register} value='Registrera' />;
}

export function Toolbar(props) {
	return <div className="buttons center">
		<GetParticipant />
		<AddParticipant />
		<Register />

		{/* For debugging */}
		<input type='button' className="button toolButton" id="deleteCookiesButton" onClick={() => props.injector.inject(AppInjector.Cookies).deleteCookies()} value='Radera Cookies' />
	</div>
}