import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Components, Events } from '.';

export class AppHeader extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { title: "Anmälningssystem Gävle PK" };
		this.subscribe(Events.changeTitle, this.updateTitle.bind(this));
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	render() {
		return <header className="App-header">
			<h1 className="App-title">
				<img src={logo} className="Gpk-logo" alt="logo" />
				{this.state.title}
				<Link to='/' className='button globaltool'>Tävlingar</Link>
				{this.inject(Components.Session).loggedIn && <Link to='' className='button globaltool' onClick={e => {
					this.inject(Components.Session).loggedIn = false;
					this.setState({});
				}}>Logga ut</Link>}
				{!this.inject(Components.Session).loggedIn && <Link to='/login' className='button globaltool'>Logga in</Link>}
				<Link to='/administration' className='button globaltool'>Administrera</Link>
				<Link to='/about' className='button globaltool'>Om...</Link>
			</h1>
		</header>
	}
}