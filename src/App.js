import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApplicationState } from './ApplicationState';
import { BusyIndicator } from './components';
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

	render() {
		const Footer = this.injector.inject(AppInjector.Footer);
		const AppHeader = this.injector.inject(AppInjector.AppHeader);
		document.title = ApplicationState.instance.competitionInfo.name;
		return (
			<div className="App">
				{this.working && <BusyIndicator />}
				<AppHeader />
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={this.injector.inject(AppInjector.Competitions)} />
						<Route exact path='/competition/:id' component={this.injector.inject(AppInjector.Registration)} />
					</Switch>
				</BrowserRouter>
				<Footer />
			</div>
		);
	}
}

export default App;
