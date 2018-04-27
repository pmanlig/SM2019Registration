import './Login.css';
import React from 'react';
import { Components } from '.';

export function Login(props) {
	return <div className='login'>
		<h3>Inloggning</h3>
		<table>
			<tbody>
				<tr><td>Användarnamn:&nbsp;</td><td><input id='userName' type='text' size='20' /></td></tr>
				<tr><td>Lösenord:</td><td><input id='password' type='password' size='20' /></td></tr>
			</tbody>
		</table>
		<input className="button" type="button" value="Logga in" onClick={e => {
			props.inject(Components.Session).loggedIn = true;
			props.history.goBack();
		}} />
	</div>;
}