import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InjectedComponent } from './components';
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
						<Route path='/competition/:id/:token' component={this.inject(Components.RegistrationView)} />
						<Route path='/competition/:id' component={this.inject(Components.RegistrationView)} />
						<Route exact path='/create' component={this.inject(Components.CreateCompetition)} />
						<Route exact path='/about' component={this.inject(Components.About)} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}