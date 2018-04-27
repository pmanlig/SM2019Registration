import './App.css';
import React from 'react';
import { InjectedComponent } from './components';
import { Components } from './AppInjector';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export class App extends InjectedComponent {
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
						<Route path='/login' component={this.inject(Components.Login)} />
						<Route path='/competition/:id/:token' component={this.inject(Components.Registration)} />
						<Route path='/competition/:id' component={this.inject(Components.Registration)} />
						<Route exact path='/about' component={this.inject(Components.About)} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}