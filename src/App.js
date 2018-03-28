import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Registration } from './Registration';
import { RegistrationForm } from './RegistrationForm';
import { Summary } from './Summary';

function Working(props) {
	return <div id="working" className="fullscreen modal"><p className="centered">Working...</p></div>;
}

function CookieAlert(props) {
	return <div id="cookieAlert" className="footer" onClick={props.hideCookieAlert}><p className="centered">Sidan sparar information i cookies på din dator för att underlätta framtida anmälningar.</p></div>;
}

function extractValue(cname, value, result) {
	if (value.startsWith(cname + "=")) {
		result[cname] = value.split('=')[1];
	}
}

async function loadCookies(callback) {
	let result = {};
	await decodeURIComponent(document.cookie).split(';').forEach(c => {
		console.log("Cookie: " + c);
		extractValue("cookieAlert", c, result);
	});
	callback(result);
}

class App extends Component {
	timer;

	constructor(props) {
		super(props);
		this.state = { registration: new Registration(this.updateState.bind(this)), working: true, cookieAlert: true };
		loadCookies(c => {
			this.setState({ ...c, working: false });
		});
	}

	updateState() {
		this.setState({ ...this.state });
	}

	render() {
		return (
			<div className="App">
				{this.state.working === true && <Working />}
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<RegistrationForm registration={this.state.registration} />
				<Summary registration={this.state.registration} />
				{this.state.cookieAlert === true && <CookieAlert hideCookieAlert={(e) => {
					document.cookie = "cookieAlert=false;";
					this.setState({ cookieAlert: false });
				}} />}
			</div>
		);
	}
}

export default App;
