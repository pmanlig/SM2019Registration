import "./CompetitionView.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Permissions, Operations } from '../models';

export class CompetitionView extends React.Component {
	static register = { name: "CompetitionView" };
	static wire = ["Competition", "Events", "EventBus", "RegistrationView", "ReportView", "ResultView",
		"CompetitionAdmin", "RosterView", "RegistrationsView", "Configuration", "CompetitionGroups", "TeamView"];

	tabs = {
		register: this.RegistrationView,
		teams: this.TeamView,
		registrations: this.RegistrationsView,
		results: this.ResultView,
		report: this.ReportView,
		roster: this.RosterView,
		admin: this.CompetitionAdmin
	}

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => this.setState({}));
		this.subscribe(this.Events.modeChanged, () => this.setState({}));
		this.subscribe(this.Events.serverChanged, () => this.Competition.load(props.match.params.id));
		this.Competition.load(props.match.params.id);
	}

	findContent(tabs) {
		let content = null;
		tabs.forEach(t => {
			if (this.props.match.params.operation === t.path) {
				content = this.tabs[t.path];
			}
		});
		return content;
	}

	componentDidUpdate() {
		this.CompetitionGroups.setGroup(this.CompetitionGroups.findGroup(this.Competition.group));
	}

	render() {
		// Wait; competition is loading
		if (this.Competition.id !== this.props.match.params.id) { return <div className="content"><p>Hämtar tävling...</p></div>; }

		let group = this.CompetitionGroups.findGroup(this.Competition.group);

		let tabs = Operations.filter(t =>
			this.Competition.permissions === Permissions.Own ||
			(
				t.permission <= this.Competition.permissions &&
				(
					t.status === undefined ||
					t.status === this.Competition.status
				)));

		if (tabs.length === 0) { return <Redirect to="/" />; }

		// Handle links to the competition in general
		if (this.props.match.params.operation === undefined) { return <Redirect to={`/competition/${this.Competition.id}/${tabs[0].path}`} /> }

		let Content = this.findContent(tabs);
		if (Content === null) { return <Redirect to="/" />; }

		return <div>
			{this.Configuration.mode === "computer" && <div className="tabs" style={{ backgroundColor: group.background }}>
				{tabs.length > 1 && tabs.map(t => {
					if (this.props.match.params.operation === t.path) { return <p key={t.path} className="tab">{t.name}</p> }
					return <Link key={t.path} className="tab" to={`/competition/${this.Competition.id}/${t.path}`}>{t.name}</Link>;
				})}
			</div>}
			<Content {...this.props} />
		</div>;
	}
}