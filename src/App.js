import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApplicationState } from './ApplicationState';
import { AppInjector } from './AppInjector';

class App extends Component {
	constructor(props) {
		super(props);
		this.injector = new AppInjector();
		ApplicationState.instance = new ApplicationState(this.setState.bind(this));
		this.loadSettings();
	}

	loadSettings() {
		const myName = "App";
		let busy = this.injector.inject("Busy");
		let cookies = this.injector.inject("Cookies");
		busy.setBusy(myName, true);
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
					busy.setBusy(myName, false);
				});
		});
	}

	render() {
		const BusyIndicator = this.injector.inject(AppInjector.BusyIndicator);
		const Footer = this.injector.inject(AppInjector.Footer);
		const AppHeader = this.injector.inject(AppInjector.AppHeader);
		document.title = ApplicationState.instance.competitionInfo.name;
		return (
			<BrowserRouter>
				<div className="App">
					<BusyIndicator />
					<AppHeader />
					<Switch>
						<Route exact path='/' component={this.injector.inject(AppInjector.Competitions)} />
						<Route exact path='/competition/:id' component={this.injector.inject(AppInjector.Registration)} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
