import './Login.css';
import React from 'react';
import { InjectedComponent } from '../logic';
import { withTitle } from '../components';
import { Components, Events } from '.';

export function withLogin(View) {
	return class extends InjectedComponent {
		constructor(props) {
			super(props);
			this.subscribe(Events.userChanged, () => {
				this.setState({});
			});
		}

		render() {
			if (this.inject(Components.Session).user === "") {
				return <LoginView {...this.props} />;
			}
			return <View {...this.props} />;
		}
	}
}

export const Login = withLogin(props => { props.history.goBack(); return null; });

export const LoginView = withTitle("Logga in", class extends InjectedComponent {
	login = (e) => {
		e.preventDefault();
		this.inject(Components.Session).login(this.user.value, this.password.value);
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