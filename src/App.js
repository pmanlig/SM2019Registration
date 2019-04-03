import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ComponentTest } from './views';

export class App extends React.Component {
	static register = { name: "App" };
	static wire = ["AppHeader", "BusyIndicator", "Footers", "Footer", "StoreQuestion", "Storage", "CompetitionList",
		"LoginView", "CompetitionView", "ReportView", "CreateCompetition", "AboutView", "WithLogin", "HelpView", "Diagnostics",
		"Configuration", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.configurationLoaded, () => {
			console.log("Configuration loaded - re-rendering");
			this.setState({});
		});
	}

	render() {
		if (!this.Configuration.loaded) return <div className="content">Hämtar konfiguration...</div>;

		if (this.Storage.get(this.Storage.keys.allowStorage) === undefined) {
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
						<Route path="/help" component={this.HelpView} />
						<Route path="/test" component={ComponentTest} />
						<Route path="/diagnostic" component={this.Diagnostics} />
						<Route exact path="/" component={this.CompetitionList} />
						<Route path="/" component={props => <div><h1>404 - Den här sidan finns inte</h1></div>} />
					</Switch>
					<this.Footer />
				</div>
			</BrowserRouter>
		);
	}
}