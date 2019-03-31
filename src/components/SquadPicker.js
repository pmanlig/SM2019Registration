import './SquadPicker.css';
import React from 'react';
import { Schedule } from '../models';

export class SquadPicker extends React.Component {
	static register = { name: "SquadPicker" };
	static wire = ["EventBus", "Events", "Server", "Competition", "Footers"];

	constructor(props) {
		super(props);
		this.state = {};
		this.EventBus.manageEvents(this);
		this.EventBus.subscribe(this.Events.showSchedule, this.showSchedule);
	}

	showSchedule = (participant, event, round) => {
		this.Server.loadSchedule(event.schedule, json => {
			this.Server.loadParticipants(event.schedule, pJson => {
				this.setState({
					event: event,
					schedule: Schedule.fromJson(json, pJson),
					participant: participant,
					round: round,
					division: participant.getDivision(event.id, round)
				});
			}, this.Footers.errorHandler("Kan inte hämta deltagare"));
		}, this.Footers.errorHandler("Kan inte hämta schema"));
	}

	selectSquad = (squad) => {
		if (!this.canRegister(squad)) return;
		let { participant, event, round } = this.state;
		this.EventBus.fire(this.Events.selectSquad, participant.id, event.id, round, squad);
		this.setState({ schedule: undefined });
	}

	squadStatus(squad) {
		if (squad.slots === squad.participants.length) { return "full"; }
		if (squad.participants.length === 0) { return "empty"; }
		return "partial";
	}

	canRegister(squad) {
		return this.squadStatus(squad) !== "full" && squad.divisions.some(d => d.includes(this.state.division));
	}

	toggleExpand = (e, squad) => {
		e.stopPropagation();
		squad.expand = !squad.expand;
		this.setState({});
	}

	squadHeader(squad) {
		let className = this.squadStatus(squad);
		if (this.canRegister(squad)) className = className + " selectable";
		return <tr key={squad.id} className={className} onClick={e => this.selectSquad(squad)}>
			<td className="time">{squad.startTime}</td>
			<td>{squad.divisions.join()}</td>
			<td>{`${squad.participants.length} / ${squad.slots}`}</td>
			<td>
				{squad.participants.length > 0 &&
					<button className={(squad.expand ? "button-collapse small" : "button-expand small")} onClick={e => this.toggleExpand(e, squad)} />}
			</td>
		</tr>;
	}

	renderSquad(squad) {
		let rows = [];
		rows.push(this.squadHeader(squad));
		if (squad.expand && squad.participants.length > 0) {
			rows = rows.concat(squad.participants.map(p =>
				<tr key={p.id} className="participant">
					<td className="time">{p.name}</td>
					<td>?</td>
					<td>&nbsp;</td>
					<td>{p.division}</td>
				</tr>
			));
		}
		return rows;
	}

	render() {
		let schedule = this.state.schedule;
		if (schedule === undefined) { return null; }

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