import "./AppHeader.css";
import logo from './../gpk_logo_wht.png';
import React from 'react';
import { Link } from 'react-router-dom';

export class AppHeader extends React.Component {
	static register = { name: "AppHeader" };
	static wire = ["LoginLogout", "LocalToggle", "DeleteCookies", "ModeSelector", "Events", "EventBus", "Session", "Configuration"];

	constructor(props) {
		super(props);
		this.state = { title: props.title };
		document.title = props.title;
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.changeTitle, this.updateTitle.bind(this));
		this.subscribe(this.Events.userChanged, () => this.setState({}));
		this.subscribe(this.Events.configurationLoaded, () => this.setState({}));
		this.subscribe(this.Events.modeChanged, mode => this.setMode(mode));
	}

	updateTitle(t) {
		this.setState({ title: t });
		document.title = t;
	}

	setMode = mode => {
		this.setState({});
	}

	AdminButton = (props) => {
		return this.Session.user !== "" && <Link to="/admin" className="globaltool">Administrera</Link>;
	}

	mobileHeader() {
		return <header className="App-header mobile">
			<h1 className="App-title">{this.state.title}</h1>
			<div id="App-header-tools">
				<div id="global-tools">
					<this.ModeSelector />
					<Link to="/" className='globaltool'>Hem</Link>
					<Link to="/help" className='globaltool'>Hjälp?</Link>
					<Link to="/about" className='globaltool'>Om...</Link>
				</div>
			</div>
		</header>
	}

	normalHeader() {
		return <header className="App-header">
			<h1 className="App-title">
				<Link to="/"><img src={logo} className="Gpk-logo" alt="logo" /></Link>
				{this.state.title}
			</h1>
			<div id="App-header-tools">
				<div id="global-tools">
					<this.ModeSelector />
					<this.LocalToggle />
					<this.DeleteCookies />
					<this.AdminButton />
					<this.LoginLogout />
					<Link to="/" className='globaltool'>Hem</Link>
					<Link to="/help" className='globaltool'>Hjälp?</Link>
					<Link to="/about" className='globaltool'>Om...</Link>
				</div>
				<p className="version">version {process.env.REACT_APP_VERSION}{this.Configuration.loaded && this.Configuration.site === "utveckling" && " (utveckling)"}</p>
			</div>
		</header>
	}

	render() {
		return (this.Configuration.mode === "mobile") ?
			this.mobileHeader() :
			this.normalHeader();
	}
}