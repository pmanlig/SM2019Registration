import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CookieAlert, loadCookies, setCookie, COOKIE_ALERT } from './Cookies';
import { ApplicationState } from './ApplicationState';
import { Footer } from './Footer';
import { BusyIndicator } from './components/BusyIndicator';
import { AppHeader } from './components/AppHeader';
import { Competitions } from './components/Competitions';
import { Registration } from './components/Registration';

class App extends Component {
	static messageId = 0;

	constructor(props) {
		super(props);
		this.state = { footers: [] };
		ApplicationState.instance = new ApplicationState(
			this.setState.bind(this),
			this.addFooter.bind(this));
		this.loadSettings();
	}

	loadSettings() {
		ApplicationState.instance.working = true;
		loadCookies(c => {
			if (c.cookieAlert !== "false") {
				this.addCookieAlertFooter();
			}
			if (c.competitors) {
				ApplicationState.instance.registry = JSON.parse(c.competitors);
			}
			// Call WS https://dev.bitnux.com/sm2019/list/1
			fetch('sm2019.json')
				.then(result => result.json())
				.then(json => {
					ApplicationState.instance.setCompetitionInfo(json);
					ApplicationState.instance.working = false;
					this.setState({});
				});
		});
	}

	deleteFooter(id) {
		this.setState({ footers: this.state.footers.filter(f => f.id !== id) });
	}

	addFooter(f, type, timeout) {
		if (type === undefined) { type = "error"; }
		if (timeout === undefined) { timeout = 3000; }
		let myId = App.messageId++;
		this.setState({ footers: [{ id: myId, content: <div key={myId} className={type}><p className="centered">{f}</p></div> }].concat(this.state.footers) });
		let timer = setTimeout(() => {
			this.deleteFooter(myId);
			clearTimeout(timer);
		}, timeout);
	}

	addCookieAlertFooter() {
		let myId = App.messageId++;
		this.setState({
			footers: this.state.footers.concat([{
				id: myId,
				content:
					<CookieAlert key={myId} onClick={e => {
						ApplicationState.instance.storeParticipants = e.target.value;
						setCookie(COOKIE_ALERT, false);
						this.deleteFooter(myId);
					}} />
			}])
		});
	}

	render() {
		document.title = ApplicationState.instance.competitionInfo.name;
		return (
			<div className="App">
				<BusyIndicator />
				<AppHeader />
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={Competitions} />
						<Route exact path='/competition/:id' component={Registration} />
					</Switch>
				</BrowserRouter>
				<Footer footers={this.state.footers.map(f => f.content)} />
			</div>
		);
	}
}

export default App;
