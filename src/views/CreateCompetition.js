import "./CreateCompetition.css";
import React from 'react';
import { Events, InjectedComponent, Components, StorageKeys } from '../logic';
import { withTitle } from '../components';

export const CreateCompetition = withTitle("Skapa ny tävling", class extends InjectedComponent {
	constructor(props) {
		super(props);
		let data = this.inject(Components.Storage).get(StorageKeys.newCompetition);
		if (data) {
			data = JSON.parse(data);

			// deserialize date strings
			if (data.events) {
				data.events.forEach(e => e.date = new Date(e.date));
			}

			// handle old format
			if (data.event && data.events.length === 0) {
				data.events.push({ name: data.event.name, date: new Date(data.event.date) });
			}
			if (data.events.length === 0) {
				data.events.push({ name: "", date: new Date() });
			}
		}
		this.subscribe(Events.competitionUpdated, () =>
			this.inject(Components.Storage).set(StorageKeys.newCompetition, this.inject(Components.Competition).toJson()));
		this.inject(Components.Competition).initialize();
		this.inject(Components.Competition).loadFrom(data);
	}

	createCompetition = () => {
		// ToDo: create & blank
		// this.inject(Components.Storage).set(StorageKeys.newCompetition, JSON.stringify(this.inject(Components.Competition)));
		console.log(this.inject(Components.Competition));
	}

	render() {
		const CompetitionProperties = this.inject(Components.CompetitionProperties);
		return <div className="content">
			<button id="saveButton" className="button" onClick={this.createCompetition}>Skapa</button>
			<CompetitionProperties />
		</div >;
	}
});