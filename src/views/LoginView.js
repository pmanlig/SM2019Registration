import './LoginView.css';
import React from 'react';
import { Events } from '.';

export class WithLogin extends React.Component {
	static register = true;
	static wire = ["EventBus", "Session", "LoginControl"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(Events.userChanged, () => { this.setState({}); });
	}

	render() {
		return this.Session.user === "" ? <this.LoginControl {...this.props} /> : <div>{this.props.children}</div>;
	}
}

export class LoginView extends React.Component {
	static register = true;
	static wire = ["WithLogin"]

	GoBack(props) {
		return <div>{props.history.goBack()}</div>
	}

	render() {
		return <this.WithLogin><this.GoBack {...this.props} /></this.WithLogin>;
	}
}