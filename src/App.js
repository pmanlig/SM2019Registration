import './App.css';
import React from 'react';
import { InjectedComponent } from './components/InjectedComponent';
import { Components } from './AppInjector';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApplicationState } from './ApplicationState';

class App extends React.Component {
	constructor(props) {
		super(props);
		ApplicationState.instance = new ApplicationState(this.setState.bind(this));
		this.loadSettings();
	}

	loadSettings() {
		const myName = "App";
		let busy = this.inject(Components.Busy);
		let cookies = this.inject(Components.Cookies);
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
		const BusyIndicator = this.inject(Components.BusyIndicator);
		const Footer = this.inject(Components.Footer);
		const AppHeader = this.inject(Components.AppHeader);
		document.title = ApplicationState.instance.competitionInfo.name;
		return (
			<BrowserRouter>
				<div className="App">
					<BusyIndicator />
					<AppHeader />
					<Switch>
						<Route exact path='/' component={this.inject(Components.Competitions)} />
						<Route exact path='/competition/:id' component={this.inject(Components.Registration)} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
