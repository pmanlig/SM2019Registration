import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ComponentTest } from './views';

export class App extends React.Component {
	static register = true;
	static wire = ["AppHeader", "BusyIndicator", "Footers", "Footer", "StoreQuestion", "Storage", "CompetitionList",
	 "LoginView", "CompetitionView", "ReportView", "CreateCompetition", "AboutView"]
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
						<Route exact path='/competition/:id/:operation/:token' component={this.CompetitionView} />
						<Route exact path='/competition/:id/:operation' component={this.CompetitionView} />
						<Route exact path='/competition/:id' component={this.CompetitionView} />
						<Route exact path='/report/:id' component={this.ReportView} />
						<Route exact path='/create' component={this.CreateCompetition} />
						<Route exact path='/about' component={this.AboutView} />
						<Route exact path='/test' component={ComponentTest} />
					</Switch>
					<this.Footer />
				</div>
			</BrowserRouter>
		);
	}
}