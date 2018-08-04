import "./CreateCompetition.css";
import React from 'react';
import { Events, StorageKeys } from '../logic';
import { withEvents } from '../logic';

export class CreateCompetition extends React.Component {
	static wire = ["Storage", "Competition", "CompetitionProperties", "WithLogin"];

	constructor(props) {
		super(props);
		let data = this.Storage.get(StorageKeys.newCompetition);
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
			this.Storage.set(StorageKeys.newCompetition, this.Competition.toJson()));
		this.Competition.initialize();
		this.Competition.loadFrom(data);
	}

	createCompetition = () => {
		// ToDo: create & blank
		// this.inject(Components.Storage).set(StorageKeys.newCompetition, JSON.stringify(this.inject(Components.Competition)));
		console.log(this.Competition);
	}

	render() {
		return <this.WithLogin>
			<this.WithTitle title="Skapa ny tävling" />
			<div className="content">
				<button id="saveButton" className="button" onClick={this.createCompetition}>Skapa</button>
				<this.CompetitionProperties />
			</div >
		</this.WithLogin>;
	}
}

export const CreateCompetitionWithEvents = withEvents(CreateCompetition);