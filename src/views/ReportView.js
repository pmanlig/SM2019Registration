import './ReportView.css';
import React from 'react';
import { ResultsTable } from '../components';
import { InjectedComponent } from '../logic';
import { Components, Events } from '.';

export class ReportView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {
			eventId: "none"
		};
		this.inject(Components.Results).load(props.match.params.id);
		this.fire(Events.changeTitle, "Registrera resultat för " + this.inject(Components.Competition).name);
		this.subscribe(Events.competitionUpdated, this.updateCompetition);
		this.subscribe(Events.resultsUpdated, () => this.setState({}));
	}

	updateCompetition = () => {
		this.fire(Events.changeTitle, "Registrera resultat för " + this.inject(Components.Competition).name);
		this.setState({ eventId: "none" });
	}

	changeEvent(newEvent) {
		this.inject(Components.Server).loadResults(this.state.competition.id, newEvent, r => this.setState({ eventId: newEvent, results: r }));
	}

	getSelectedEvent(competition) {
		if (competition.events.length === 1) {
			return competition.events[0];
		}
		if (this.state.eventId === "none") {
			return null;
		}
		return competition.events.filter(e => toString(e.id) === toString(this.state.eventId))[0];
	}

	render() {
		let competition = this.inject(Components.Competition);
		let selectedEvent = this.getSelectedEvent(competition);
		let results = this.inject(Components.Results);
		return <div id="results" className="content">
			{competition.events.length > 1 &&
				<div>Resultat för deltävling <select value={this.state.eventId} onChange={e => this.changeEvent(e.target.value)}>
					<option value="none">Välj deltävling</option>
					{this.inject(Components.Registration).competition.events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
				</select></div>}
			<ResultsTable results={results} event={selectedEvent} />
			<button className={results.isDirty() ? "button" : "button disabled"} onClick={() => results.store()}>Spara</button>
			<button className="button" onClick={() => results.sort()}>Sortera</button>
		</div>;
	}
}