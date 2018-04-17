import logo from './../logo.svg';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppInjector } from '../AppInjector';
import { EventBus } from '../EventBus';

export class AppHeader extends Component {
	constructor(props) {
		super(props);
		this.state = { title: "Anmälningssystem Gävle PK" };
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	componentDidMount() {
		this.subscription = this.props.injector.inject(AppInjector.EventBus).subscribe(EventBus.changeTitle, this.updateTitle.bind(this));
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return <header className="App-header">
			<h1 className="App-title">
				<img src={logo} className="App-logo" alt="logo" />
				{this.state.title}
				<Link to='/' className='button globaltool'>Tävlingar</Link>
				<Link to='/administration' className='button globaltool'>Administrera</Link>
			</h1>
		</header>
	}
}