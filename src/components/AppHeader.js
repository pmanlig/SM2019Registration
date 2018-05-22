import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Components, Events } from '.';

export class AppHeader extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { title: props.title };
		document.title = props.title;
		// ToDo: Do this more React:y
		this.subscribe(Events.changeTitle, this.updateTitle.bind(this));
		this.subscribe(Events.userChanged, () => this.setState({}));
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
				{session.user !== "" && <Link to='' className='button globaltool' onClick={e => {
					session.logout();
					e.preventDefault();
				}}>{'Logga ut ' + session.user}</Link>}
				{session.user === "" && <Link to='/login' className='button globaltool'>Logga in</Link>}
			</h1>
		</header>
	}
}