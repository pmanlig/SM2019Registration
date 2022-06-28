import './Global.css';
import React from 'react';
import { Link } from 'react-router-dom';

export class LoginLogout extends React.Component {
	static register = { name: "LoginLogout" };
	static wire = ["Session"];

	toggle = e => {
		this.Session.logout();
		e.preventDefault();
	}

	render() {
		return this.Session.user !== "" ?
			<Link to='' className='globaltool' onClick={this.toggle}>Logga ut<span className="bloat">{' ' + this.Session.user}</span></Link> :
			<Link to="/login" className='globaltool'>Logga in</Link>;
	}
}

export class DeleteCookies extends React.Component {
	static register = { name: "DeleteCookies" };
	static wire = ["Storage", "Registration", "Registry"];

	delete = () => {
		this.Storage.delete();
		this.Registration.newRegistration();
		this.Registry.initialize();
	}

	render() {
		return this.Storage.get(this.Storage.keys.allowStorage) !== undefined && <Link to='' className='globaltool' onClick={this.delete}>Rensa<span className="bloat"> sparad information</span></Link>;
	}
}

export class LocalToggle extends React.Component {
	static register = { name: "LocalToggle" }
	static wire = ["Server", "Session", "Storage"];

	constructor(props) {
		super(props);
		this.state = { show: false /*this.Storage.get(this.Storage.keys.toggleServerMode)*/ };
	}

	toggle = e => {
		this.Server.setLocal(!this.Server.local);
		this.Session.logout();
		e.preventDefault();
		this.setState({});
	}

	render() {
		return this.state.show ? <Link to='' className='globaltool' onClick={this.toggle}>{this.Server.local ? "Local" : "Online"}</Link> : null;
	}
}

export class ModeSelector extends React.Component {
	static register = { name: "ModeSelector" }
	static wire = ["Configuration", "Events", "EventBus"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.modeChanged, () => this.setState({}));
	}

	toggleMode = e => {
		this.Configuration.setMode(this.Configuration.mode === "computer" ? "mobile" : "computer");
		e.preventDefault();
		this.setState({});
	}

	render() {

		return this.Configuration.mode === "computer" ?
			<div className="slider globaltool">
				<div className="globaltool disabled right">Mobil</div>
				<Link to='' className='globaltool' onClick={this.toggleMode}>Dator</Link>
			</div> :
			<div className="slider globaltool">
				<Link to='' className='globaltool' onClick={this.toggleMode}>Mobil</Link>
				<div className="globaltool disabled left">Dator</div>
			</div>;
	}
}