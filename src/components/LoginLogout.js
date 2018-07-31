import React from 'react';
import { Link } from 'react-router-dom';

export class LoginLogout extends React.Component {
	static isComponent = true;
	static inject = ["Session"];

	render() {
		return this.Session.user !== "" ?
			<Link to='' className='globaltool' onClick={e => {
				this.Session.logout();
				e.preventDefault();
			}}>{'Logga ut ' + this.Session.user}</Link> :
			<Link to='/login' className='globaltool'>Logga in</Link>;
	}
}