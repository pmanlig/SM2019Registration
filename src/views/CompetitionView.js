import "./Tabs.css";
import "./CompetitionView.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Mode, Permissions } from '../models';
import { competitionTabs } from ".";

export class CompetitionView extends React.Component {
	static register = { name: "CompetitionView" };
	static wire = ["Competition", "Events", "EventBus", "Configuration", "CompetitionGroups"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => this.setState({}));
		this.subscribe(this.Events.modeChanged, () => this.setState({}));
		this.subscribe(this.Events.serverChanged, () => this.Competition.load(props.match.params.id));
		this.Competition.load(props.match.params.id);
	}

	componentDidUpdate() {
		this.CompetitionGroups.setGroup(this.CompetitionGroups.findGroup(this.Competition.group));
	}

	render() {
		let { id, operation } = this.props.match.params;

		// Wait; competition is loading
		if (this.Competition.id !== id) { return <div className="content"><p>Hämtar tävling...</p></div>; }

		let group = this.CompetitionGroups.findGroup(this.Competition.group);
		let tabs = competitionTabs().map(t => t.tabInfo).filter(t =>
			this.Competition.permissions === Permissions.Own ||
			(
				t.permissions <= this.Competition.permissions &&
				(
					t.status === undefined ||
					t.status === this.Competition.status
				)));

		if (tabs.length === 0) { return <Redirect to="/" />; }

		// Handle links to the competition in general
		if (operation === undefined) { return <Redirect to={`/competition/${this.Competition.id}/${tabs[0].path}`} /> }

		let Content = competitionTabs().find(t => t.tabInfo.path === operation);
		if (Content === null) { return <Redirect to="/" />; }

		return <div>
			{this.Configuration.mode === Mode.computer && <div className="tabs" style={{ backgroundColor: group.background }}>
				{tabs.length > 1 && tabs.map(t => operation === t.path ?
					<p key={t.path} className="tab">{t.name}</p> :
					<Link key={t.path} className="tab" to={`/competition/${this.Competition.id}/${t.path}`}>{t.name}</Link>)}
				{group.url && group.url.startsWith("http") && <a key="homepage" className="tab" href={group.url}>Tillbaka till hemsidan &gt;</a>}
			</div>}
			<Content {...this.props} />
		</div>;
	}
}