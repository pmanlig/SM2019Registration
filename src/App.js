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

class App extends Component {
	timer;

	constructor(props) {
		super(props);
		this.state = { registration: new Registration(() => this.setState({ ...this.state }), () => this.register()), working: true, cookieAlert: false };
		this.loadCookies(c => {
			this.setState({ ...c, working: false });
		});
	}

	unlimitedCookieExpiration() {
		let d = new Date();
		d.setFullYear(d.getFullYear() + 20);
		return "expires=" + d.toUTCString() + ';';
	}

	setCookie(name, value, expiration) {
		if (!expiration) {
			expiration = this.unlimitedCookieExpiration();
		}
		document.cookie = name + '=' + value + ';' + expiration;
	}

	register() {
		this.setCookie("competitors", JSON.stringify(this.state.registration.participants));
	}

	extractValue(cname, value, result) {
		if (value.startsWith(cname + "=")) {
			result[cname] = value.split('=')[1];
		}
	}

	async loadCookies(callback) {
		let result = { cookieAlert: true };
		await decodeURIComponent(document.cookie).split(';').forEach(c => {
			console.log("Cookie: " + c);
			this.extractValue("cookieAlert", c, result);
		});
		callback(result);
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
					this.setCookie("cookieAlert", "false");
					this.setState({ cookieAlert: false });
				}} />}
			</div>
		);
	}
}

export default App;
