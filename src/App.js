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
	static messageId = 0;

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
			if (c.cookieAlert !== "false") {
				this.addCookieAlertFooter();
			}
			if (c.competitors) {
				ApplicationState.instance.registry = JSON.parse(c.competitors);
			}
			this.setState({ working: false });
		});
	}

	deleteFooter(id) {
		this.setState({ footers: this.state.footers.filter(f => f.id !== id) });
	}

	addFooter(f, timeout) {
		if (timeout === undefined) { timeout = 3000 }
		let myId = App.messageId++;
		console.log(myId);
		this.setState({ footers: this.state.footers.concat([{ id: myId, content: <div key={myId} className="error"><p className="centered">{f}</p></div> }]) });
		let timer = setTimeout(() => {
			this.deleteFooter(myId);
			clearTimeout(timer);
		}, timeout);
	}

	addCookieAlertFooter() {
		let myId = App.messageId++;
		this.setState({
			footers: this.state.footers.concat([{
				id: myId,
				content:
					<CookieAlert key={myId} onClick={e => {
						ApplicationState.instance.storeParticipants = e.target.value;
						setCookie(COOKIE_ALERT, false);
						this.deleteFooter(myId);
					}} />
			}])
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
				<Footer footers={this.state.footers.map(f => f.content)} />
				{this.state.showPicker === true && <ParticipantPicker
					registry={ApplicationState.instance.registry}
					onClick={this.getParticipant} />}
			</div>
		);
	}
}

export default App;
