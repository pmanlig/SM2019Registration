import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Registration } from './Registration';
import { RegistrationForm } from './RegistrationForm';
import { Summary } from './Summary';
import { ParticipantPicker } from './ParticipantPicker';
import { CookieAlert, loadCookies, setCookie, COOKIE_ALERT } from './Cookies';
import { Person } from './Person';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			registration: new Registration(
				() => this.setState({ ...this.state }),
				() => this.register()),
			registry: [
				new Person("Patrik Manlig", 28283, "Gävle PK"),
				new Person("Izabell Sjödin", 45396, "Gävle PK"),
				new Person("Johan Söderberg", 45397, "Gävle PK")
			],
			getParticipant: (e) => { this.setState({ showPicker: true }); },
			working: true,
			showPicker: false,
			cookieAlert: false
		};
		loadCookies(c => {
			this.setState({ cookieAlert: true, ...c, working: false });
		});
	}

	register() {
		setCookie("competitors", JSON.stringify(this.state.registration.participants));
	}

	updateState() {
		this.setState({});
	}

	render() {
		return (
			<div className="App">
				{this.state.working === true && <div className="fullscreen shadow" ><p className="centered">Working...</p></div>}
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<RegistrationForm registration={this.state.registration} getParticipant={(e) => { this.setState({ showPicker: true }); }} />
				<Summary registration={this.state.registration} />
				{this.state.cookieAlert === true && <CookieAlert onClick={e => {
					this.setState({ cookieAlert: false });
					setCookie(COOKIE_ALERT, false);
				}} />}
				{this.state.showPicker === true && <ParticipantPicker
					registry={this.state.registry}
					onClick={p => {
						this.state.registration.addParticipant(p);
						this.setState({ showPicker: false });
					}} />}
			</div>
		);
	}
}

export default App;
