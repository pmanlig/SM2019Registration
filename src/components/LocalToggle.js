import React from 'react';
import { Link } from 'react-router-dom';

export class LocalToggle extends React.Component {
	static register = { name: "LocalToggle" }
	static wire = ["Server", "Session", "Storage"];

	constructor(props) {
		super(props);
		this.state = { show: this.Storage.get(this.Storage.keys.toggleServerMode) };
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