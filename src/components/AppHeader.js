import "./AppHeader.css";
import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';

export class AppHeader extends React.Component {
	static register = { name: "AppHeader" };
	static wire = ["LoginLogoutButton", "subscribe", "Events"];

	constructor(props) {
		super(props);
		this.state = { title: props.title };
		document.title = props.title;
		// ToDo: Do this more React:y
		this.subscribe(this.Events.changeTitle, this.updateTitle.bind(this));
		this.subscribe(this.Events.userChanged, () => this.setState({}));
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	render() {
		return <header className="App-header">
			<h1 className="App-title">
				<Link to="/"><img src={logo} className="Gpk-logo" alt="logo" /></Link>
				{this.state.title}
			</h1>
			<this.LoginLogoutButton />
			<Link to="/about" className='globaltool'>Om...</Link>
		</header>
	}
}