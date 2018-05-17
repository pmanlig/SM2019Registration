import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Components, Events } from '.';

export class AppHeader extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { title: props.title };
		document.title = props.title;
		this.subscribe(Events.changeTitle, this.updateTitle.bind(this));
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	render() {
		let session = this.inject(Components.Session);
		return <header className="App-header">
			<h1 className="App-title">
				<Link to="/"><img src={logo} className="Gpk-logo" alt="logo" /></Link>
				{this.state.title}
				<Link to='/about' className='button globaltool'>Om...</Link>
				{session.loggedIn && <Link to='' className='button globaltool' onClick={e => {
					session.loggedIn = false;
					this.setState({});
					e.preventDefault();
				}}>{'Logga ut ' + session.user}</Link>}
				{!session.loggedIn && <Link to='/login' className='button globaltool'>Logga in</Link>}
			</h1>
		</header>
	}
}