import './ReportView.css';
import React from 'react';

export class ReportView extends React.Component {
	static register = true;
	static wire = ["fire", "Competition", "Registration", "Results", "Server", "ResultsTable", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = {
			eventId: "none"
		};
		this.Results.load(props.match.params.id);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, this.updateCompetition);
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
	}

	componentWillMount() {
		this.fire(this.Events.changeTitle, "Registrera resultat för " + this.Competition.name);
	}

	updateCompetition = () => {
		this.fire(this.Events.changeTitle, "Registrera resultat för " + this.Competition.name);
		this.setState({ eventId: "none" });
	}

	changeEvent(newEvent) {
		this.Server.loadResults(this.state.competition.id, newEvent, r => this.setState({ eventId: newEvent, results: r }));
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
		let selectedEvent = this.getSelectedEvent(this.Competition);
		return <div id="results" className="content">
			{this.Competition.events.length > 1 &&
				<div>Resultat för deltävling <select value={this.state.eventId} onChange={e => this.changeEvent(e.target.value)}>
					<option value="none">Välj deltävling</option>
					{this.Competition.events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
				</select></div>}
			<this.ResultsTable results={this.Results} event={selectedEvent} />
			<button className={this.Results.isDirty() ? "button" : "button disabled"} onClick={() => this.Results.store()}>Spara</button>
			<button className="button" onClick={() => this.Results.sort()}>Sortera</button>
		</div>;
	}
}