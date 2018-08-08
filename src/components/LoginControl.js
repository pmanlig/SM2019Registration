import React from 'react';

export class LoginControl extends React.Component {
	static register = true;
	static wire = ["Session", "Events", "EventBus"];

	login = (e) => {
		e.preventDefault();
		this.Session.login(this.user.value, this.password.value);
	}

	componentWillMount() {
		this.EventBus.fire(this.Events.changeTitle, "Logga in");
	}

	componentDidMount() {
		this.userpama.focus();
	}

	render() {
		return <div className='login'>
			<form className='login' onSubmit={this.login}>
				<h3>Inloggning</h3>
				<table>
					<tbody>
						<tr><td>Användarnamn:&nbsp;</td><td><input id='userName' ref={user => this.user = user} type='text' size='20' /></td></tr>
						<tr><td>Lösenord:</td><td><input id='password' type='password' size='20' ref={input => this.password = input} /></td></tr>
					</tbody>
				</table>
				<button className="button" type="submit">Logga in</button>
			</form>
		</div>;
	}
}
