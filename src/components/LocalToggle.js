import React from 'react';
import { Link } from 'react-router-dom';

export class LocalToggle extends React.Component {
	static register = { name: "LocalToggle" }
	static wire = ["Server", "Session"];

	toggle = e => {
		this.Server.setLocal(!this.Server.local);
		this.Session.logout();
		e.preventDefault();
		this.setState({});
	}

	render() {
		return <Link to='' className='globaltool' onClick={this.toggle}>{this.Server.local ? "Local" : "Online"}</Link>
	}
}