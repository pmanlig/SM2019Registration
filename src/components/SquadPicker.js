import './SquadPicker.css';
import React from 'react';
import { Time } from '../logic';
import { Schedule } from '../models';

export class SquadPicker extends React.Component {
	static register = { name: "SquadPicker" };
	static wire = ["EventBus", "Events", "Server", "Competition", "Footers", "Busy"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.showSchedule, this.showSchedule);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({ participant: undefined }));
		this.state = {};
	}

	loadSchedules = (scheduleIds, schedules, callback) => {
		if (scheduleIds.length > 0) {
			this.Busy.setBusy("sqPick", true);
			let scheduleId = scheduleIds.pop();
			this.Server.loadSchedule(scheduleId, json => {
				this.Server.loadParticipants(scheduleId, pJson => {
					schedules.push(Schedule.fromJson(json, pJson));
					this.loadSchedules(scheduleIds, schedules, callback);
				}, this.Footers.errorHandler("Kan inte hämta deltagare"));
			}, this.Footers.errorHandler("Kan inte hämta schema"));
		} else {
			this.Busy.setBusy("sqPick", false);
			callback(schedules);
		}
	}

	getDefaultDivision = (eventDivisions) => {
		if (eventDivisions === undefined) return undefined;
		return this.Competition.divisions(eventDivisions)[0];
	}

	showSchedule = (participant, event, round) => {
		this.loadSchedules(this.Competition.events.map(e => e.schedule).filter(s => s !== undefined), [], (schedules) => {
			this.setState({
				schedules: schedules,
				event: event,
				participant: participant,
				round: round,
				division: participant.getDivision(event.id, round) || this.getDefaultDivision(event.divisions)
			});
		});
	}

	selectSquad = (squad) => {
		if (!this.canRegister(squad)) return;
		let { participant, event, round } = this.state;
		this.EventBus.fire(this.Events.selectSquad, participant.id, event.id, round, squad);
		this.setState({ participant: undefined });
	}

	getSchedule = (scheduleId) => {
		return this.state.schedules.find(s => s.id === scheduleId);
	}

	squadStatus(squad) {
		if (squad.slots === squad.participants.length) { return "full"; }
		if (squad.participants.length === 0) { return "empty"; }
		return "partial";
	}

	allowedDivisions(squad) {
		if (squad.mixed) return squad.divisions;
		if (squad.participants.length > 0) return squad.divisions.filter(d => squad.participants.some(p => d.includes(p.division)));
		return squad.divisions;
	}

	timeFromSquad(eventId, squadId) {
		let event = this.Competition.event(eventId);
		let schedule = this.getSchedule(event.schedule);
		let startTime = Time.timeFromText(schedule.squads.find(s => s.id === squadId).startTime);
		return { from: startTime, to: startTime + Time.timeFromText(schedule.duration), date: event.date };
	}

	calculateStartTimes() {
		let p = this.state.participant;
		let registeredSquads = [].concat(...p.registrationInfo.map(ri => ri.rounds.map(rd => { return { event: ri.event, squad: rd.squad } })));
		registeredSquads = registeredSquads
			.filter(s => s.squad !== undefined)
			.filter(s => s.squad !== p.registrationInfo.filter(ri => ri.event === this.state.event.id).map(ev => ev.rounds[this.state.round].squad).find(s => true)) // Remove current registration from consideration
			.map(st => this.timeFromSquad(st.event, st.squad))
			.filter(st => st.date.valueOf() === this.state.event.date.valueOf());
		return registeredSquads;
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
			(this.state.division === undefined || this.allowedDivisions(squad).some(d => d.includes(this.state.division)));
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
		if (this.state.participant === undefined) return null;
		let schedule = this.getSchedule(this.state.event.schedule);
		return <div className="squad-picker">
			<div className="squad-picker-header">
				<h1>Starttider</h1><button className="button-close medium" onClick={() => this.setState({ participant: undefined })} />
			</div>
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