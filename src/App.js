import './App.css';
import React from 'react';
import { InjectedComponent } from './components';
import { Components } from './AppInjector';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export class App extends InjectedComponent {
	constructor(props) {
		super(props);
		this.inject(Components.Cookies).loadCookies();
	}

	render() {
		const BusyIndicator = this.inject(Components.BusyIndicator);
		const Footer = this.inject(Components.Footer);
		const AppHeader = this.inject(Components.AppHeader);
		// return <div><h1>Testing</h1></div>;
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