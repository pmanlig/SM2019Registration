import './SquadPicker.css';
import React from 'react';
import { Time } from '../logic';
import { Schedule } from '../models';

export class SquadPicker extends React.Component {
	static register = { name: "SquadPicker" };
	static wire = ["EventBus", "Events", "Server", "Competition", "Footers"];

	constructor(props) {
		super(props);
		this.schedulesToLoad = this.Competition.events.map(e => e.schedule).filter(s => s !== undefined);
		this.schedules = [];
		this.EventBus.manageEvents(this);
		this.EventBus.subscribe(this.Events.showSchedule, this.showSchedule);
		this._isMounted = false;
		this.state = {};
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	loadSchedule = (scheduleId, callback) => {
		this.Server.loadSchedule(scheduleId, json => {
			this.Server.loadParticipants(scheduleId, pJson => {
				this.schedules.push(Schedule.fromJson(json, pJson));
				callback();
			}, this.Footers.errorHandler("Kan inte hämta deltagare"));
		}, this.Footers.errorHandler("Kan inte hämta schema"));
	}

	showSchedule = (participant, event, round) => {
		if (this.schedulesToLoad.length > 0) {
			this.loadSchedule(this.schedulesToLoad.pop(), () => this.showSchedule(participant, event, round));
		} else {
			if (this._isMounted)
				this.setState({
					event: event,
					participant: participant,
					round: round,
					division: participant.getDivision(event.id, round) || this.Competition.divisions(event.divisions)[0]
				});
		}
	}

	selectSquad = (squad) => {
		if (!this.canRegister(squad)) return;
		let { participant, event, round } = this.state;
		this.EventBus.fire(this.Events.selectSquad, participant.id, event.id, round, squad);
		this.setState({ participant: undefined });
	}

	getSchedule = (scheduleId) => {
		return this.schedules.find(s => s.id === scheduleId);
	}

	squadStatus(squad) {
		if (squad.slots === squad.participants.length) { return "full"; }
		if (squad.participants.length === 0) { return "empty"; }
		return "partial";
	}

	allowedDivisions(squad) {
		if (squad.mixed) return squad.divisions;
		if (squad.participants.length > 0) return [...new Set(squad.participants.map(p => p.division))];
		return squad.divisions;
	}

	timeFromSquad(eventId, squadId) {
		let schedule = this.getSchedule(this.Competition.events.find(e => e.id === eventId).schedule);
		let startTime = Time.timeFromText(schedule.squads.find(s => s.id === squadId).startTime);
		return { from: startTime, to: startTime + Time.timeFromText(schedule.duration) };
	}

	calculateStartTimes() {
		let p = this.state.participant;
		let registeredSquads = [].concat(...p.registrationInfo.map(ri => ri.rounds.map(rd => { return { event: ri.event, squad: rd.squad } })));
		return registeredSquads
			.filter(s => s.squad !== p.registrationInfo.find(ri => ri.event === this.state.event.id).rounds[this.state.round].squad)
			.filter(s => s.squad !== undefined)
			.map(st => this.timeFromSquad(st.event, st.squad));
	}

	allowedStartTime(squad) {
		let times = this.calculateStartTimes();
		let myTime = this.timeFromSquad(this.state.event.id, squad.id);
		return !times.some(t =>
			(t.from >= myTime.from && t.from < myTime.to) ||
			(t.to <= myTime.to && t.to > myTime.from) ||
			(myTime.from >= t.from && myTime.from < t.to) ||
			(myTime.to <= t.to && myTime.to > t.from)
		);
	}

	canRegister(squad) {
		return this.squadStatus(squad) !== "full" &&
			this.allowedStartTime(squad) &&
			this.allowedDivisions(squad).some(d => d.includes(this.state.division));
	}

	toggleExpand = (e, squad) => {
		e.stopPropagation();
		squad.expand = !squad.expand;
		this.setState({});
	}

	squadHeader(squad) {
		let className = this.squadStatus(squad) + (this.canRegister(squad) ? " selectable" : " unavailable");
		return <tr key={squad.id} className={className} onClick={e => this.selectSquad(squad)}>
			<td className="time">{squad.startTime}</td>
			<td>{this.allowedDivisions(squad).join()}</td>
			<td>{`${squad.participants.length} / ${squad.slots}`}</td>
			<td>
				{squad.participants.length > 0 &&
					<button className={(squad.expand ? "button-collapse small" : "button-expand small")} onClick={e => this.toggleExpand(e, squad)} />}
			</td>
		</tr>;
	}

	renderParticipant(p) {
		return <tr key={p.id} className="participant">
			<td className="time">{p.name}</td>
			<td>{p.division}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>;
	}

	renderSquad(squad) {
		let rows = [];
		rows.push(this.squadHeader(squad));
		if (squad.expand && squad.participants.length > 0) {
			rows = rows.concat(squad.participants.map(p => this.renderParticipant(p)));
		}
		return rows;
	}

	render() {
		if (this.schedulesToLoad.length > 0 || this.state.participant === undefined) return null;
		let schedule = this.getSchedule(this.state.event.schedule);
		return <div className="squad-picker">
			<h1>Starttider</h1>
			<div style={{ overflowY: "auto" }}>
				<table>
					<thead>
						<tr>
							<th className="time">Tid</th>
							<th>Vapengrupp</th>
							<th>Platser</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{schedule && schedule.squads && schedule.squads.map(s => this.renderSquad(s))}
					</tbody>
				</table>
			</div>
		</div>;
	}
}