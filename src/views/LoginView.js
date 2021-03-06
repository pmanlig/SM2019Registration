import './LoginView.css';
import React from 'react';
import { Events } from '.';

export class WithLogin extends React.Component {
	static register = { name: "WithLogin" };
	static wire = ["EventBus", "Session", "LoginControl"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(Events.userChanged, () => { this.setState({}); });
	}

	render() {
		return this.Session.user === "" ? <this.LoginControl {...this.props} /> : this.props.children;
	}
}

export class LoginView extends React.Component {
	static register = { name: "LoginView" };
	static wire = ["WithLogin"]

	GoBack(props) {
		return <div>{props.history.goBack()}</div>
	}

	render() {
		return <this.WithLogin><this.GoBack {...this.props} /></this.WithLogin>;
	}
}