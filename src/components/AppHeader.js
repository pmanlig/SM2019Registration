import "./AppHeader.css";
import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent, Components, Events } from '.';

export function withTitle(title, View) {
	return class extends InjectedComponent {
		componentDidMount() {
			this.fire(Events.changeTitle, title);
		}

		render() {
			return <View {...this.props} />;
		}
	}
}

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
		const LoginLogout = this.inject(Components.LoginLogout);
		return <header className="App-header">
			<h1 className="App-title">
				<Link to="/"><img src={logo} className="Gpk-logo" alt="logo" /></Link>
				{this.state.title}
			</h1>
			<LoginLogout />
			<Link to='/about' className='globaltool'>Om...</Link>
		</header>
	}
}