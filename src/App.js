import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InjectedComponent } from './components';
import { Components, StorageKeys } from './AppInjector';
import { ComponentTest } from './views';

export class App extends InjectedComponent {
	render() {
		const BusyIndicator = this.inject(Components.BusyIndicator);
		const Footer = this.inject(Components.Footer);
		const StoreQuestion = this.inject(Components.StoreQuestion);
		const storage = this.inject(Components.Storage);
		if (storage.get(StorageKeys.allowStorage) === undefined) {
			this.inject(Components.Footers).addCustomFooter(<StoreQuestion key="cookieAlert" storage={storage} />);
		}

		return (
			<BrowserRouter>
				<div className="App">
					<BusyIndicator />
					<this.props.injector.AppHeader title="Anmälningssystem Gävle PK" />
					<Switch>
						<Route exact path='/' component={this.inject(Components.Competitions)} />
						<Route exact path='/login' component={this.inject(Components.Login)} />
						<Route exact path='/competition/:id/:operation/:token' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/competition/:id/:operation' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/competition/:id' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/report/:id' component={this.inject(Components.ReportView)} />
						<Route exact path='/create' component={this.inject(Components.CreateCompetition)} />
						<Route exact path='/about' component={this.inject(Components.About)} />
						<Route exact path='/test' component={ComponentTest} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}