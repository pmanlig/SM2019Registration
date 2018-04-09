import React from 'react';
import logo from './../logo.svg';
import { ApplicationState } from './../ApplicationState';

export function AppHeader(props) {
	return <header className="App-header">
		<h1 className="App-title">
			<img src={logo} className="App-logo" alt="logo" />
			{"Anmälan till " + ApplicationState.instance.competitionInfo.description}
		</h1>
	</header>
}