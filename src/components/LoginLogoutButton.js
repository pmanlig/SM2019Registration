import React from 'react';
import { Link } from 'react-router-dom';

export class LoginLogoutButton extends React.Component {
	static register = true;
	static wire = ["Session"];

	render() {
		return this.Session.user !== "" ?
			<Link to='' className='globaltool' onClick={e => {
				this.Session.logout();
				e.preventDefault();
			}}>{'Logga ut ' + this.Session.user}</Link> :
			<Link to='/login' className='globaltool'>Logga in</Link>;
	}
}