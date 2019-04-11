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
			<Link to='' className='globaltool' onClick={this.toggle}>{'Logga ut ' + this.Session.user}</Link> :
			<Link to="/login" className='globaltool'>Logga in</Link>;
	}
}

export class DeleteCookies extends React.Component {
	static register = { name: "DeleteCookies" };
	static wire = ["Storage"];

	delete = () => {
		this.Storage.delete();
	}

	render() {
		return this.Storage.get(this.Storage.keys.allowStorage) !== undefined && <Link to='' className='globaltool' onClick={this.delete}>Rensa sparad information</Link>;
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