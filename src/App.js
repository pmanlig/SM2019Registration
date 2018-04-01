import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { RegistrationForm } from './RegistrationForm';
import { Summary } from './Summary';
import { Toolbar } from './Toolbar';
import { ParticipantPicker } from './ParticipantPicker';
import { CookieAlert, loadCookies, setCookie, COOKIE_ALERT } from './Cookies';
import { ApplicationState } from './ApplicationState';
import { Footer } from './Footer';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			working: true,
			showPicker: false,
			footers: []
		};
		ApplicationState.instance = new ApplicationState(
			this.setState.bind(this),
			m => { this.addFooter(m); });
		loadCookies(c => {
			if (c.cookieAlert !== false) {
				this.addCookieAlertFooter();
			}
			if (c.competitors) {
				ApplicationState.instance.registry = JSON.parse(c.competitors);
			}
			this.setState({ working: false });
		});
	}

	deleteFooter(index) {
		let newFooters = this.state.footers.concat();
		newFooters.splice(index, 1);
		this.setState({ footers: newFooters });
	}

	addFooter(f, timeout) {
		if (timeout === undefined) { timeout = 3000 }
		let index = this.state.footers.length;
		this.setState({ footers: this.state.footers.concat([<div key={index} className="error"><p className="centered">{f}</p></div>]) });
		setTimeout(() => {
			this.deleteFooter(index);
		}, timeout);
	}

	addCookieAlertFooter() {
		let index = this.state.footers.length;
		this.setState({
			footers: this.state.footers.concat([
				<CookieAlert key={index} onClick={e => {
					ApplicationState.instance.storeParticipants = e.target.value;
					setCookie(COOKIE_ALERT, false);
					this.deleteFooter(index);
				}} />])
		});
	}

	getParticipant = p => {
		let appState = ApplicationState.instance;
		let f = x => { return x.competitionId === p.competitionId; };
		if (p !== undefined && appState.registration.find(f) !== undefined) {
			this.addFooter("Deltagaren finns redan!");
		} else {
			ApplicationState.instance.addParticipant(p);
		}
		this.setState({ showPicker: false });
	}

	render() {
		return (
			<div className="App">
				{this.state.working === true && <div className="fullscreen shadow" ><p className="centered">Working...</p></div>}
				<header className="App-header">
					<h1 className="App-title">
						<img src={logo} className="App-logo" alt="logo" />
						Anmälan till Svenska Mästerskapen 2019 i Fält, Precision och Militär Snabbmatch med Pistol och Revolver
					</h1>
				</header>
				<Toolbar getParticipant={() => this.setState({ showPicker: true })} />
				<RegistrationForm />
				<Summary />
				<Footer footers={this.state.footers} />
				{this.state.showPicker === true && <ParticipantPicker
					registry={ApplicationState.instance.registry}
					onClick={this.getParticipant} />}
			</div>
		);
	}
}

export default App;
