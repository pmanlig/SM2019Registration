import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Registration } from './Registration';
import { RegistrationForm } from './RegistrationForm';
import { Summary } from './Summary';
import { ParticipantPicker } from './ParticipantPicker';
import { CookieAlert, loadCookies, setCookie } from './Cookies';
import { Person } from './Person';

function Working(props) {
	return <div id="working" className="fullscreen modal"><p className="centered">Working...</p></div>;
}

class App extends Component {
	timer;

	constructor(props) {
		super(props);
		this.state = {
			registration: new Registration(
				() => this.setState({ ...this.state }),
				() => this.register()),
			registry: [
				new Person("Patrik Manlig", 28283, "Gävle PK"),
				new Person("Izabell Sjödin", 45396, "Gävle PK"),
			],
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
				{this.state.working === true && <Working />}
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<RegistrationForm registration={this.state.registration} />
				<Summary registration={this.state.registration} />
				{this.state.cookieAlert === true && <CookieAlert onClick={e => this.setState({ cookieAlert: false })} />}
				{this.state.showPicker === true && <ParticipantPicker registry={this.state.registry}/>}
			</div>
		);
	}
}

export default App;
