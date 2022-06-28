import './ReportView.css';
import React from 'react';
import { Permissions, Schedule, TabInfo } from '../models';

export class ReportView extends React.Component {
	static register = { name: "ReportView" };
	static wire = ["fire", "Competition", "Registration", "Results", "Server", "ReportTable",
		"EventBus", "Events", "Footers", "Configuration", "ReportIndicator"];
	static tabInfo = new TabInfo("Rapportera", "report", 200, Permissions.Admin);

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
			this.state.stageDef = (event.stages && event.stages[0]);
			if (event.schedule !== 0 && event.schedule !== undefined) {
				this.Server.loadSchedule(event.schedule, this.updateSchedule, this.Footers.errorHandler("Kan inte hämta startlista för tävlingen"));
			}
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
		return event != null && event.stages != null && event.stages.length > 0 && event.stages;
	}

	setStage = stage => {
		let stageDefs = this.getStageDefs(this.state.event);
		if (stageDefs) {
			this.setState({ stageDef: stageDefs.find(s => s.num === stage) });
		}
	}

	updateResults = () => {
		this.setState({ participants: this.Results.scores });
	}

	updateSchedule = schedule => {
		schedule = Schedule.fromJson(schedule);
		this.setState({ schedule: schedule, squad: schedule.squads[0], participants: this.Results.scores.filter(s => s.squad === schedule.squads[0].id) });
		// this.Server.loadParticipants(schedule.id, this.updateParticipants, this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	updateParticipants = participants => {
		this.setState({ participants: participants });
	}

	changeEvent(newEvent) {
		newEvent = parseInt(newEvent, 10);
		this.setEvent(this.state.eventList.find(e => e.id === newEvent));
	}

	changeSquad = squadId => {
		squadId = parseInt(squadId, 10);
		this.setState({ squad: this.state.schedule.squads.find(s => s.id === squadId) });
	}

	hasErrors() {
		let { stageDef, participants, squad } = this.state;
		let errors = participants.filter(p => p.squad === squad.id).filter(p => !p.validateScore(stageDef));
		if (errors.length > 0) { console.log(errors); }
		return errors.length > 0;
	}

	next = e => {
		let { event, squad, stageDef, schedule } = this.state;
		if (!this.hasErrors()) {
			this.Results.report(event, squad, stageDef.num);
			for (let i = 0; i < schedule.squads.length - 1; i++) {
				if (squad === schedule.squads[i]) {
					this.setState({ squad: schedule.squads[i + 1] });
					return;
				}
			}
		}
		this.setState({});
	}

	NextButton = props => {
		return <p type="button" id="next-button" className="button" onClick={this.next}>Nästa &gt;</p>;
	}

	QueueButton = props => {
		return <div id="queue-button"><this.ReportIndicator /></div>;
	}

	render() {
		let { eventList, event, schedule, squad, stageDef } = this.state;
		let stageDefs = this.getStageDefs(event);
		let scores = this.Results.getScores(squad && squad.id);
		if (squad) {
			scores = scores.sort((a, b) => a.position - b.position);
			scores.forEach((s, i) => s.position = i + 1);
		}
		stageDef = stageDef || stageDefs[0];
		return <div id="results" className="content">
			<div id="selections">
				{eventList.length > 1 &&
					<div id="event-selector">Resultat för deltävling:
						<select value={event.id} onChange={e => this.changeEvent(e.target.value)}>
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
			<this.QueueButton />
		</div>;
	}
}