import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Components } from '../logic';

export class LoginLogout extends InjectedComponent {
	render() {
		let session = this.inject(Components.Session);
		return session.user !== "" ?
			<Link to='' className='globaltool' onClick={e => {
				session.logout();
				e.preventDefault();
			}}>{'Logga ut ' + session.user}</Link> :
			<Link to='/login' className='globaltool'>Logga in</Link>;
	}
}