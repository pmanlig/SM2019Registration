import "./CompetitionView.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { Permissions, Operations } from '../models';
import { Components, Events } from '.';

export class CompetitionView extends InjectedComponent {
	static register = true;
	// static inject = ["subscribe"];

	tabs = {
		register: this.inject(Components.RegistrationView),
		report: this.inject(Components.ReportView),
		results: this.inject(Components.ResultView),
		admin: () => <h5>Administrera</h5>
	}

	constructor(props) {
		super(props);
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
		this.inject(Components.Competition).load(props.match.params.id);
	}

	findContent(tabs) {
		let content = null;
		tabs.forEach(t => { if (this.props.match.params.operation === t.path) { content = this.tabs[t.path]; } });
		return content;
	}

	render() {
		let competition = this.inject(Components.Competition);

		// Wait; competition is loading
		if (competition.id !== this.props.match.params.id) { return null; }

		let tabs = Operations.filter(t =>
			competition.permissions === Permissions.Own ||
			(
				t.permission <= competition.permissions &&
				(
					t.status === undefined ||
					t.status === competition.status
				)));

		// Handle links to the competition in general
		if (this.props.match.params.operation === undefined) { return <Redirect to={"/competition/" + competition.id + "/" + tabs[0].path} /> }

		let Content = this.findContent(tabs);
		if (Content === null) { return <Redirect to='/' />; }

		return <div>
			<div className="tabs">
				{tabs.length > 1 && tabs.map(t => {
					if (this.props.match.params.operation === t.path) { return <p key={t.path} className="tab">{t.name}</p> }
					return <Link key={t.path} className="tab" to={"/competition/" + competition.id + "/" + t.path}>{t.name}</Link>;
				})}
			</div>
			<Content {...this.props} />
		</div>;
	}
}