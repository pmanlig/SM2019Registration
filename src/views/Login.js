import './Login.css';
import '../components/Buttons.css';
import React from 'react';
import { Events } from '.';

export class LoginControl extends React.Component {
	static wire = ["Session", "WithTitle"];

	login = (e) => {
		e.preventDefault();
		this.Session.login(this.user.value, this.password.value);
	}

	render() {
		return <div className='login content'>
			<this.WithTitle title="Logga in" />
			<form className='login' onSubmit={this.login}>
				<h3>Inloggning</h3>
				<table>
					<tbody>
						<tr><td>Användarnamn:&nbsp;</td><td><input id='userName' type='text' size='20' ref={input => this.user = input} /></td></tr>
						<tr><td>Lösenord:</td><td><input id='password' type='password' size='20' ref={input => this.password = input} /></td></tr>
					</tbody>
				</table>
				<button className="button" type="submit">Logga in</button>
			</form>
		</div>;
	}
}

export class WithLogin extends React.Component {
	static register = true;
	static wire = ["subscribe", "Session"];

	constructor(props) {
		super(props);
		this.subscribe(Events.userChanged, () => {
			this.setState({});
		});
	}

	render() {
		return this.Session.user === "" ? <LoginControl {...this.props} /> : <div>{this.props.children}</div>;
	}
}

export class LoginView extends React.Component {
	static register = true;
	static wire = ["WithLogin"]

	GoBack() {
		return <div>{this.props.history.goBack()}</div>
	}

	render() {
		return <this.WithLogin>{this.props.history.goBack()}</this.WithLogin>;
	}
}