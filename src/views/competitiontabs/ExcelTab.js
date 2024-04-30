import React from 'react';
import { TabInfo, Permissions } from '../../models';

export class ExcelTab extends React.Component {
	static register = { name: "ListsTab" }
	static wire = ["Events", "EventBus", "Configuration", "Competition"];
	static tabInfo = new TabInfo("Excel", "excel", 203, Permissions.Admin);

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, `Listor för ${this.Competition.name}`);
	}

	render() {
		return <div className="content">
			<h2>Deltagare</h2>
			<a href={`${this.Configuration.baseUrl}/excel/${this.Competition.id}/division`} download="true">Alla deltagare (vapenkontroll)</a><br />
			<a href={`${this.Configuration.baseUrl}/excel/${this.Competition.id}/team`} download="true">Alla lag</a><br />
			<a href={`${this.Configuration.baseUrl}/excel/${this.Competition.id}/allt`} download="true">All information</a><br />
			<br />
			{this.Competition.events.map(e => <a key={`d${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/list`} download="true">{`Deltagare i ${e.name || this.Competition.name}`}<br /></a>)}
			<h2>Starttider</h2>
			{this.Competition.events.map(e => <a key={`s${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/squad`} download="true">{`Starttider i ${e.name || this.Competition.name}`}<br /></a>)}
			<h2>Resultat</h2>
			{this.Competition.events.map(e => <a key={`r${e.id}`} href={`${this.Configuration.baseUrl}/excel/result/${e.id}`} download="true">Resultat för {e.name || this.Competition.name}<br /></a>)}
			<h2>Lagresultat</h2>
			{this.Competition.events.map(e => <a key={`s${e.id}`} href={`${this.Configuration.baseUrl}/excel/result/team/${e.id}`} download="true">{`Lagresultat för ${e.name || this.Competition.name}`}<br /></a>)}
		</div>
	}
}