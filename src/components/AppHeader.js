import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Events } from '.';

export class AppHeader extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { title: "Anmälningssystem Gävle PK" };
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	componentDidMount() {
		this.subscription = this.subscribe(Events.changeTitle, this.updateTitle.bind(this));
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return <header className="App-header">
			<h1 className="App-title">
				<img src={logo} className="Gpk-logo" alt="logo" />
				{this.state.title}
				<Link to='/' className='button globaltool'>Tävlingar</Link>
				<Link to='/administration' className='button globaltool'>Administrera</Link>
			</h1>
		</header>
	}
}