import './Login.css';
import '../components/Buttons.css';
import React from 'react';
import { withTitle } from '../components';
import { Events } from '.';

export function withLogin(View) {
	return class extends React.Component {
		static register = View.register ? { ...View.register, name: View.register.name || View.name } : View.register;
		static inject = ["subscribe", "Session", View];

		constructor(props) {
			super(props);
			this.subscribe(Events.userChanged, () => {
				this.setState({});
			});
		}

		render() {
			if (this.Session.user === "") {
				return <LoginView {...this.props} />;
			}
			return <View {...this.props} />;
		}
	}
}

export function login(props) {
	props.history.goBack();
	return null;
}

login.register = { name: "Login" };

export const Login = withLogin(login);

export const LoginView = withTitle("Logga in", class extends React.Component {
	static register = { name: "LoginView" };
	static inject = ["Session"];

	login = (e) => {
		e.preventDefault();
		this.Session.login(this.user.value, this.password.value);
	}

	render() {
		return <div className='login content'>
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
});