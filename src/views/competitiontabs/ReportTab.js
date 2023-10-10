import './Report.css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Discipline, Permissions, Schedule, TabInfo } from '../../models';
import { StageSelector } from '../../components';

export class ReportTab extends React.Component {
	static register = { name: "ReportView" };
	static wire = ["fire", "Competition", "Registration", "Results", "Server", "ReportTable",
		"EventBus", "Events", "Footers", "Configuration", "ReportIndicator"];
	static tabInfo = new TabInfo("Rapportera", "report", 200, Permissions.Admin);

	constructor(props) {
		super(props);
		this.state = { eventList: [], schedule: null, squad: null, participants: null };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, this.updateCompetition);
		this.subscribe(this.Events.resultsUpdated, this.updateResults);
		if (this.Competition.id === props.match.params.id) { this.setTitle(); }
	}

	setTitle() {
		this.fire(this.Events.changeTitle, `Registrera resultat för ${this.Competition.name}`);
	}

	updateCompetition = () => {
		this.setTitle();
		this.setState({
			schedule: null
		});
	}

	changeEvent(newEvent) {
		newEvent = parseInt(newEvent, 10);
		newEvent = this.Competition.events.find(e => e.id === newEvent);
		this.setEvent(newEvent);
	}

	setEvent(event) {
		this.setState({ schedule: null });
		if (event !== null) { this.Results.load(this.Competition.id, event.id); }
		this.props.history.push(`/competition/${this.Competition.id}/report/${event.id}`)
	}

	updateResults = () => {
		this.setState({});
	}

	updateSchedule = schedule => {
		schedule = Schedule.fromJson(schedule);
		this.setState({ schedule: schedule });
	}

	updateParticipants = participants => {
		this.setState({ participants: participants });
	}

	changeSquad = squadId => {
		squadId = parseInt(squadId, 10);
		this.setState({ squad: this.state.schedule.squads.find(s => s.id === squadId) });
	}

	hasErrors() {
		let { p1, p2, p3 } = this.props.match.params;
		p1 = parseInt(p1, 10);
		p2 = parseInt(p2, 10);
		p3 = parseInt(p3, 10)
		let event = this.Competition.events.find(e => e.id === p1);
		let stageDef = event.stages.find(s => s.num === p3);
		let participants = this.Results.getScores(p2);
		let squad = this.state.schedule.squads.find(s => s.id === p2);
		let errors = participants.filter(p => p.squad === squad.id).filter(p => !p.validateScore(stageDef));
		if (errors.length > 0) { console.log(errors); }
		return errors.length > 0;
	}

	next = () => {
		let { id, p1, p2, p3 } = this.props.match.params;
		p1 = parseInt(p1, 10);
		p2 = parseInt(p2, 10);
		p3 = parseInt(p3, 10);
		let { schedule } = this.state;
		let event = this.Competition.events.find(e => e.id === p1);
		let squad = schedule.squads.find(s => s.id === p2);
		if (!this.hasErrors()) {
			this.Results.report(event, squad, p3);
			let i = (schedule.squads.findIndex(s => s === squad) + 1) % schedule.squads.length;
			this.props.history.replace(`/competition/${id}/report/${p1}/${schedule.squads[i].id}/${p3}`);
			this.Results.load(id, p1, true);
		} else {
			this.setState({});
		}
	}

	NextButton = props => {
		return <p type="button" id="next-button" className="button" onClick={this.next}>Nästa &gt;</p>;
	}

	QueueButton = props => {
		return <div id="queue-button"><this.ReportIndicator /></div>;
	}

	EventSelector = ({ events, event }) => {
		if (events.length < 2) { return null; }
		return <div id="event-selector">Resultat för deltävling:
			<select value={event.id} onChange={e => this.changeEvent(e.target.value)}>
				{events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
			</select></div>
	}

	setSquad(squadId) {
		let { id, p1, p3 } = this.props.match.params;
		this.props.history.replace(`/competition/${id}/report/${p1}/${squadId}/${p3}`);
	}

	SquadSelector = ({ schedule, squad }) => {
		if (schedule === undefined) { return null; }
		return <div id="squad-selector">Skjutlag/patrull:
			<select value={squad.id} onChange={e => this.setSquad(e.target.value)}>
				{schedule.squads.map(s => <option key={s.id} value={s.id}>{s.startTime.split(':').slice(0, 2).join(':')}</option>)}
			</select>
		</div>
	}

	setStage = stage => {
		let { id, p1, p2 } = this.props.match.params;
		this.props.history.replace(`/competition/${id}/report/${p1}/${p2}/${stage}`);
	}

	render() {
		let { id, p1, p2, p3 } = this.props.match.params;
		let { schedule } = this.state;

		if (id === undefined) { return <div>Fel! Ingen tävling angiven!</div>; }
		if (this.Competition.id !== id) {
			this.Competition.load(this.props.match.params.id);
			return null;
		}

		if (this.Competition.permissions < Permissions.Admin) {
			return <div className="content">
				<h2>Du har inte behörighet att mata in resultat</h2>
				<p><i>Har du loggat in? Blivit automatiskt utloggad?</i></p>
			</div>;
		}

		let { events } = this.Competition;
		if (p1 === undefined) {
			return <Redirect to={`/competition/${id}/report/${events[0].id}`} />
		}
		p1 = parseInt(p1, 10);
		if (this.Results.event !== p1) {
			this.Results.load(id, p1);
			return null;
		}

		let event = events.find(e => e.id === p1);
		if (event === undefined) { return <div>Fel! Hittar inte deltävling {p1}!</div>; }
		if (schedule === null || schedule.id !== event.schedule) {
			if (event.schedule !== 0 && event.schedule !== undefined) {
				this.Server.loadSchedule(event.schedule, this.updateSchedule, this.Footers.errorHandler("Kan inte hämta startlista för tävlingen"));
				return null;
			} else {
				return <div>Fel! Inget schema för deltävlingen!</div>;
			}
		}

		if (p2 === undefined || p3 === undefined) { return <Redirect to={`/competition/${id}/report/${p1}/${schedule.squads[0].id}/1`} /> }
		p2 = parseInt(p2, 10);
		p3 = parseInt(p3, 10);
		let squad = schedule.squads.find(s => s.id === p2);

		let hasStages = Discipline.hasStages.includes(event.discipline);
		if (hasStages && (event.stages == null || event.stages.length === 0)) { return <div>Fel! Inga serier/stationer!</div> }
		let stageDefs = event.stages;
		let stageDef = hasStages ? event.stages.find(s => s.num === p3) : [];
		let scores = this.Results.getScores(squad.id);
		scores = scores.sort((a, b) => a.position - b.position);
		scores.forEach((s, i) => s.position = i + 1);

		return <div id="results" className="content">
			<div id="selections">
				<this.EventSelector events={events} event={event} />
				<this.SquadSelector schedule={schedule} squad={squad} />
				<StageSelector stages={stageDefs} stage={stageDef} setStage={this.setStage} />
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