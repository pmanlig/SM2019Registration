import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InjectedComponent, ComponentTest } from './components';
import { Components, StorageKeys } from './AppInjector';

export class App extends InjectedComponent {
	render() {
		const BusyIndicator = this.inject(Components.BusyIndicator);
		const Footer = this.inject(Components.Footer);
		const AppHeader = this.inject(Components.AppHeader);
		const StoreQuestion = this.inject(Components.StoreQuestion);
		const storage = this.inject(Components.Storage);
		if (storage.get(StorageKeys.allowStorage) === undefined) {
			this.inject(Components.Footers).addCustomFooter(<StoreQuestion key="cookieAlert" storage={storage} />);
		}

		return (
			<BrowserRouter>
				<div className="App">
					<BusyIndicator />
					<AppHeader title="Anmälningssystem Gävle PK" />
					<Switch>
						<Route exact path='/' component={this.inject(Components.Competitions)} />
						<Route path='/login' component={this.inject(Components.Login)} />
						<Route path='/competition/:id/:operation/:token' component={this.inject(Components.CompetitionView)} />
						<Route path='/competition/:id/:operation' component={this.inject(Components.CompetitionView)} />
						<Route path='/competition/:id' component={this.inject(Components.CompetitionView)} />
						<Route path='/report/:id' component={this.inject(Components.ReportView)} />
						<Route path='/create' component={this.inject(Components.CreateCompetition)} />
						<Route path='/about' component={this.inject(Components.About)} />
						<Route path='/test' component={ComponentTest} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}