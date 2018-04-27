import './Login.css';
import React from 'react';
import { InjectedComponent } from '../logic';
import { Components, Events } from '.';

export class Login extends InjectedComponent {
	componentDidMount() {
		this.fire(Events.changeTitle, "Anmälningssytem Gävle PK");
	}

	render() {
		let session = this.inject(Components.Session);
		return <div className='login'>
			<form className='login' onSubmit={e => {
				e.preventDefault();
				if (session.user !== undefined && session.user !== "") {
					session.loggedIn = true;
					this.props.history.goBack();
				}
				// ToDo: handle denied
			}}>
				<h3>Inloggning</h3>
				<table>
					<tbody>
						<tr><td>Användarnamn:&nbsp;</td><td><input id='userName' type='text' size='20' value={session.user || ""} onChange={e => { session.user = e.target.value; this.setState({}); }} /></td></tr>
						<tr><td>Lösenord:</td><td><input id='password' type='password' size='20' /></td></tr>
					</tbody>
				</table>
				<button className="button" type="submit">Logga in</button>
			</form>
		</div>;
	}
}