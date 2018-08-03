import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InjectedComponent } from './components';
import { Components } from './AppInjector';
import { ComponentTest } from './views';

export class App extends InjectedComponent {
	static register = true;
	static wire = ["AppHeader", "BusyIndicator", "Footers", "Footer", "StoreQuestion", "Storage", "CompetitionList", "LoginView", "CompetitionView"]
	static storageKey = "allowStorage";

	render() {
		if (this.Storage.get("allowStorage") === undefined) {
			this.Footers.addCustomFooter(<this.StoreQuestion key="cookieAlert" storage={this.Storage} />);
		}
		return (
			<BrowserRouter>
				<div className="App">
					<this.BusyIndicator />
					<this.AppHeader title="Anmälningssystem Gävle PK" />
					<Switch>
						<Route exact path='/' component={this.CompetitionList} />
						<Route exact path='/login' component={this.LoginView} />
						<Route exact path='/competition/:id/:operation/:token' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/competition/:id/:operation' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/competition/:id' component={this.inject(Components.CompetitionView)} />
						<Route exact path='/report/:id' component={this.inject(Components.ReportView)} />
						<Route exact path='/create' component={this.inject(Components.CreateCompetition)} />
						<Route exact path='/about' component={this.inject(Components.About)} />
						<Route exact path='/test' component={ComponentTest} />
					</Switch>
					<this.Footer />
				</div>
			</BrowserRouter>
		);
	}
}