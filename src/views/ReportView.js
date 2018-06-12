import './ReportView.css';
import React from 'react';
import { ResultsTable } from '../components';
import { InjectedComponent } from '../logic';
import { Components, Events } from '.';

export class ReportView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {
			competition: this.inject(Components.Competition),
			eventId: "none",
			results: []
		};
		this.inject(Components.Results).load(props.match.params.id);
		this.fire(Events.changeTitle, "Registrera resultat för " + this.state.competition.name);
		this.subscribe(Events.competitionUpdated, () => {
			this.fire(Events.changeTitle, "Registrera resultat för " + this.state.competition.name);
			this.setState({});
		});
	}

	changeEvent(newEvent) {
		this.inject(Components.Server).loadResults(this.state.competition.id, newEvent, r => this.setState({ eventId: newEvent, results: r }));
	}

	getSelectedEvent() {
		if (this.state.eventId === "none") {
			return null;
		}
		return this.state.competition.events.filter(e => toString(e.id) === toString(this.state.eventId))[0];
	}

	render() {
		let selectedEvent = this.getSelectedEvent();
		console.log(selectedEvent);
		return <div id="results" className="content">
			<div>Resultat för deltävling <select value={this.state.eventId} onChange={e => this.changeEvent(e.target.value)}>
				<option value="none">Välj deltävling</option>
				{this.inject(Components.Registration).competition.events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
			</select></div>
			<ResultsTable value={this.state.results} event={selectedEvent} />
		</div>;
	}
}