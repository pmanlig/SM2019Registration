import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ComponentTest } from './views';

export class App extends React.Component {
	static register = { name: "App" };
	static wire = ["AppHeader", "BusyIndicator", "Footers", "Footer", "StoreQuestion", "Storage", "CompetitionList",
		"LoginView", "CompetitionView", "ReportView", "CreateCompetition", "AboutView", "WithLogin"]
	static storageKey = "allowStorage";

	render() {
		if (this.Storage.get("allowStorage") === undefined) {
			this.Footers.addCustomFooter(<this.StoreQuestion key="cookieAlert" storage={this.Storage} />);
		}

		// console.log(`Public URL: ${process.env.PUBLIC_URL}`);
		// Necessary to use WithLogin here, otherwise title won't update correctly
		return (
			<BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
				<div className="App">
					<this.BusyIndicator />
					<this.AppHeader title="Anmälningssystem Gävle PK" />
					<Switch>
						<Route path="/login" component={this.LoginView} />
						<Route path="/competition/:id/:operation/:token" component={this.CompetitionView} />
						<Route path="/competition/:id/:operation" component={this.CompetitionView} />
						<Route path="/competition/:id" component={this.CompetitionView} />
						<Route path="/report/:id" component={this.ReportView} />
						<Route path="/create" component={props => <this.WithLogin><this.CreateCompetition /></this.WithLogin>} />
						<Route path="/about" component={this.AboutView} />
						<Route path="/test" component={ComponentTest} />
						<Route exact path="/" component={this.CompetitionList} />
						<Route path="/" component={props => <div><h1>404 - Den här sidan finns inte</h1></div>} />
					</Switch>
					<this.Footer />
				</div>
			</BrowserRouter>
		);
	}
}