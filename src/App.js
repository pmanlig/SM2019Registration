import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApplicationState } from './ApplicationState';
import { BusyIndicator } from './components';
import { AppHeader } from './components/AppHeader';
import { Competitions } from './components/Competitions';
import { AppInjector } from './AppInjector';

class App extends Component {
	static messageId = 0;

	constructor(props) {
		super(props);
		this.injector = new AppInjector();
		ApplicationState.instance = new ApplicationState(this.setState.bind(this));
		this.state = { working: true };
		this.loadSettings();
	}

	loadSettings() {
		ApplicationState.instance.working = true;
		let cookies = this.injector.inject("Cookies")
		cookies.loadCookies(() => {
			ApplicationState.instance.storeParticipants = cookies.storeCookies ? "Ja" : "Nej";
			if (cookies.competitors) {
				ApplicationState.instance.registry = JSON.parse(cookies.competitors);
			}
			// Call WS https://dev.bitnux.com/sm2019/list/1
			fetch('/sm2019.json')
				.then(result => result.json())
				.then(json => {
					ApplicationState.instance.setCompetitionInfo(json);
					ApplicationState.instance.working = false;
					this.setState({ working: false });
				});
		});
	}

	/*
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
		*/

	render() {
		const Footer = this.injector.inject(AppInjector.Footer);
		document.title = ApplicationState.instance.competitionInfo.name;
		return (
			<div className="App">
				{this.working && <BusyIndicator />}
				<AppHeader />
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={Competitions} />
						<Route exact path='/competition/:id' component={this.injector.inject("Registration")} />
					</Switch>
				</BrowserRouter>
				<Footer />
			</div>
		);
	}
}

export default App;
