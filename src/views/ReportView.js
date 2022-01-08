import './ReportView.css';
import React from 'react';
import { StageDef } from '../models';

export class ReportView extends React.Component {
	static register = { name: "ReportView" };
	static wire = ["fire", "Competition", "Registration", "Results", "Server", "ReportTable", "EventBus", "Events", "Footers", "Configuration"];
	static testStages = [
		new StageDef(1, 6, 6, false, 6),
		new StageDef(2, 6, 4, false, 2, 1),
		new StageDef(3, 6, 1, true, 6),
		new StageDef(4, 6, 4, false, 3),
		new StageDef(5, 6, 5, false, 2, 1),
		new StageDef(6, 6, 2, false, 4),
		new StageDef(7, 6, 2, true, 3),
		new StageDef(8, 6, 1, false, 6)
	];

	constructor(props) {
		super(props);
		this.state = { eventList: [], event: null, schedule: null, squad: null, participants: null };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, this.updateCompetition);
		this.subscribe(this.Events.resultsUpdated, this.updateResults);
		if (this.Competition.id === props.match.params.id) {
			this.setTitle();
			let { events } = this.Competition;
			let event = events[0];
			this.state.eventList = events;
			this.state.event = event;
			if (event.schedule !== 0 && event.schedule !== undefined) {
				this.Server.loadSchedule(event.schedule, this.updateSchedule, this.Footers.errorHandler("Kan inte hämta startlista för tävlingen"));
			}
			this.state.stageDef = (event.stages && event.stages[0]);
			this.state.stageDef = this.state.stageDef || ReportView.testStages[0]; // Debugging
			this.Results.load(this.Competition.id, event.id);
		}
		else {
			this.Competition.load(props.match.params.id);
		}
	}

	setTitle() {
		this.fire(this.Events.changeTitle, "Registrera resultat för " + this.Competition.name);
	}

	updateCompetition = () => {
		this.setTitle();
		this.setEventList(this.Competition.events);
	}

	setEventList(eventList) {
		this.setState({ eventList: eventList });
		this.setEvent(eventList[0]);
	}

	setEvent(event) {
		this.setState({
			event: event,
			schedule: null,
			squad: null,
			participants: null,
		});
		if (event !== null) {
			this.setStage(1);
			this.Results.load(this.Competition.id, event.id);
			if (event.schedule !== 0 && event.schedule !== undefined) {
				this.Server.loadSchedule(event.schedule, this.updateSchedule, this.Footers.errorHandler("Kan inte hämta startlista för tävlingen"));
			}
		}
	}

	getStageDefs(event) {
		// console.log("StageDefs", (event != null && event.stages != null && event.stages) || ReportView.testStages);
		return (event != null && event.stages != null && event.stages) || ReportView.testStages; // For debugging
	}

	setStage = stage => {
		// console.log("Setting stageDef", this.getStageDefs(this.state.event), stage, this.getStageDefs(this.state.event).find(s => s.num === stage));
		this.setState({ stageDef: this.getStageDefs(this.state.event).find(s => s.num === stage) });
	}

	updateResults = () => {
		this.setState({ participants: this.Results.scores });
	}

	updateSchedule = schedule => {
		console.log("Updating schedule", schedule);
		this.setState({ schedule: schedule, squad: schedule.squads[0] });
		this.Server.loadParticipants(schedule.id, this.updateParticipants, this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	updateParticipants = participants => {
		this.setState({ participants: participants });
	}

	changeEvent(newEvent) {
		this.setState({ event: this.state.eventList.find(e => e.id === newEvent) });
		this.Server.loadResults(this.Competition.id, newEvent,
			r => this.setState({ results: r }),
			this.Footers.errorHandler("Kan inte hämta resultat"));
	}

	changeSquad = squadId => {
		this.setState({ squad: this.state.schedule.squads.find(s => s.id === squadId) });
	}

	validateScores() {
		let { stageDef, participants } = this.state;
		let errors = participants.filter(p => !p.validateScore(stageDef));
		return errors.length > 0;
	}

	next = e => {
		this.setState({ validation: this.validateScores() });
	}

	NextButton = props => {
		return <p type="button" id="next-button" className="button" onClick={this.next}>Nästa &gt;</p>;
	}

	render() {
		let { eventList, event, schedule, squad, stageDef } = this.state;
		let stageDefs = this.getStageDefs(event);
		let scores = this.Results.getScores(squad && squad.id);
		console.log("ReportView", schedule);
		return <div id="results" className="content">
			<div id="selections">
				{eventList.length > 1 &&
					<div id="event-selector">Resultat för deltävling:
						<select value={event.id} onChange={e => this.changeEvent(parseInt(e.target.value, 10))}>
							{eventList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
						</select></div>}
				{schedule &&
					<div id="squad-selector">Skjutlag/patrull:
						<select value={squad.id} onChange={e => this.changeSquad(e.target.value)}>
							{schedule.squads.map(s => <option key={s.id} value={s.id}>{s.startTime.split(':').slice(0, 2).join(':')}</option>)}
						</select>
					</div>}
				{stageDefs.length > 0 && <div id="stage-selector">Serie/station:
					<select value={stageDef.num} onChange={e => this.setStage(parseInt(e.target.value, 10))}>
						{stageDefs.map(s => <option key={s.num} value={s.num}>{s.num}</option>)}
					</select>
				</div>}
				{stageDef && <div>Figurer: {stageDef.targets}</div>}
				{stageDef && <div>Maxträff: {stageDef.max}</div>}
				{stageDef && stageDef.min > 0 && <div>Min: {stageDef.min}</div>}
				{stageDef && stageDef.values && <div>Poängräkning</div>}
				<div id="spacer" style={{ flexGrow: 1 }} />
			</div>
			{stageDef && <this.ReportTable mode={this.Configuration.mode} event={event} stageDef={stageDef} scores={scores} />}
			<this.NextButton />
		</div>;
	}
}