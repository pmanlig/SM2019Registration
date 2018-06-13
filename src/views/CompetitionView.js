import "./CompetitionView.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { Permissions } from '../models';
import { Components, Events } from '.';

export class CompetitionView extends InjectedComponent {
	tabs = [
		{ name: "Anmälan", path: "register", permission: Permissions.Any, component: this.inject(Components.RegistrationView) },
		{ name: "Rapportera", path: "report", permission: Permissions.Admin, component: this.inject(Components.ReportView) },
		{ name: "Resultat", path: "results", permission: Permissions.Any, component: this.inject(Components.ResultView) },
		{ name: "Administrera", path: "admin", permission: Permissions.Own, component: () => <h5>Administrera</h5> }
	];

	constructor(props) {
		super(props);
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
		this.inject(Components.Competition).load(props.match.params.id);
	}

	findContent(tabs) {
		let content = null;
		tabs.forEach(t => { if (this.props.match.params.operation === t.path) { content = t.component; } });
		return content;
	}

	render() {
		let competition = this.inject(Components.Competition);

		// Wait; competition is loading
		if (competition.id !== this.props.match.params.id) { return null; }

		let tabs = this.tabs.filter(t => t.permission <= competition.permissions);

		// Handle links to the competition in general
		if (this.props.match.params.operation === undefined) { return <Redirect to={"/competition/" + competition.id + "/" + tabs[0].path} /> }

		let Content = this.findContent(tabs);
		if (Content === null) { return <Redirect to='/' />; }

		return <div>
			<div className="tabs">
				{tabs.map(t => {
					if (this.props.match.params.operation === t.path) { return <p key={t.path} className="tab">{t.name}</p> }
					return <Link key={t.path} className="tab" to={"/competition/" + competition.id + "/" + t.path}>{t.name}</Link>;
				})}
			</div>
			<Content {...this.props} />
		</div>;
	}
}