import React from 'react';
import { ApplicationState } from './../ApplicationState';

export function BusyIndicator(props) {
	return ApplicationState.instance.working === true && <div className="fullscreen shadow" ><p className="centered">Working...</p></div>;
}