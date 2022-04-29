import './ScheduleProperties.css';
import './Tables.css';
import React from 'react';
import { Time } from '../logic';
import { Schedule } from '../models';
import { ModalDialog } from '../general';
import {  ButtonToolbar as Toolbar, Label, Spinner, SquadProperties } from '.';

export class ScheduleProperties extends React.Component {
	static register = { name: "ScheduleProperties" };
	static wire = ["Events", "EventBus", "Competition", "Server", "Footers"];
	schedules = [];

	constructor(props) {
		super(props);
		this.state = {};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.editSchedule, this.editSchedule);
	}

	allDivisions(event) {
		return (event && event.divisions)
			? this.Competition.divisions(event.divisions).filter(d => d.charAt(0) !== '!')
			: undefined;
	}

	newScheduleInformation(event, schedule) {
		this.schedules[schedule.id] =
		{
			slots: 8,
			startTime: "8:00",
			interval: 10,
			duration: schedule.duration,
			mixDivisions: true,
			selectedDivisions: this.allDivisions(event) || [],
			event: event,
			schedule: schedule
		};
		return this.schedules[schedule.id];
	}

	loadScheduleInformation(event, schedule) {
		schedule = Schedule.fromJson(schedule);
		let newState = this.schedules[schedule.id] || this.newScheduleInformation(event, schedule);
		newState.duration = schedule.duration;
		newState.allDivisions = this.allDivisions(event);
		this.setState(newState);
	}

	editSchedule = (event) => {
		// Create new schedule if one doesn't exist
		if (event.schedule === undefined) {
			this.Server.createSchedule(new Schedule("2:00", event.divisions).toJson(), schedule => {
				event.schedule = schedule.id;
				this.loadScheduleInformation(event, schedule);
				this.Competition.updateEvent(event);
			}, this.Footers.errorHandler("Kan inte skapa schema"));
			return;
		}
		// Test schedule to handle old data format; patch event if old format
		let scheduleId = parseInt(event.schedule.toString(), 10);
		if (isNaN(scheduleId)) {
			let schedule = event.schedule;
			event.schedule = schedule.id;
			this.loadScheduleInformation(event, schedule);
			return;
		}
		// Schedule exists; load and show it
		this.Server.loadSchedule(scheduleId, schedule => {
			this.loadScheduleInformation(event, schedule);
		}, this.Footers.errorHandler("Kan inte hämta schema"));
	}

	updateStartTime(t) {
		if (!Time.canSetTime(t)) { return; }
		this.setState({ startTime: t });
	}

	blurStartTime(t) {
		this.setState({ startTime: Time.format(Time.timeFromText(t)) });
	}

	updateSlots = (v) => {
		let newVal = v;
		if (typeof v === 'string') { newVal = parseInt(v, 10); }
		if (isNaN(newVal) || newVal < 0) { return }
		this.setState({ slots: newVal });
	}

	updateInterval = (e) => {
		let newInterval = parseInt(e.target.value, 10);
		if (isNaN(newInterval)) { return }
		this.setState({ interval: newInterval });
	}

	updateDuration(t) {
		if (!Time.canSetTime(t)) { return; }
		this.setState({ duration: t });
	}

	blurDuration(t) {
		this.setState({ duration: Time.format(Time.durationFromText(t)) });
	}

	addSquad = () => {
		let { startTime, slots, selectedDivisions, mixDivisions, interval } = this.state;
		this.state.schedule.addSquad(startTime, slots, selectedDivisions, mixDivisions);
		this.setState({ startTime: Time.format(Time.timeFromText(startTime) + interval) });
	}

	deleteSquad = (s) => {
		this.state.schedule.deleteSquad(s);
		this.setState({});
	}

	updateSquadProperty = (id, property, value) => {
		this.state.schedule.updateSquadProperty(id, property, value);
	}

	selectDivision = (d) => {
		let newDivisions = this.state.selectedDivisions;
		this.setState({ selectedDivisions: newDivisions.includes(d) ? newDivisions.filter(x => x !== d) : newDivisions.concat([d]) });
	}

	onClose = () => {
		let schedule = this.state.schedule;
		schedule.duration = this.state.duration;
		schedule.divisionGroup = this.state.event.divisions || 0;
		this.Server.updateSchedule(schedule.toJson(), () => { }, this.Footers.errorHandler("Kan inte spara schema"));
		this.setState({ schedule: undefined });
	}

	onDelete = () => {
		this.Server.deleteSchedule(this.state.schedule.id, () => {
			this.Competition.updateEvent(this.state.event, "schedule", undefined);
			this.setState({ schedule: undefined });
		}, this.Footers.errorHandler("Kan inte ta bort schema"));
	}

	render() {
		if (this.state.schedule === undefined) { return null; }

		let allDivisions = this.state.allDivisions;
		let rowWidth = 11.0;
		if (allDivisions) { // ToDo: update
			rowWidth += 4;
			allDivisions.forEach(d => rowWidth += d.length + 0.5);
		}
		rowWidth = rowWidth + "em";
		return <ModalDialog className="schedule-properties" title="Skjutlag/patruller" onClose={this.onClose} showClose="true">
			<Toolbar className="schedule-tools">
				<Label text="Starttid">
					<input className="schedule-property" value={this.state.startTime} size="5"
						onChange={e => this.updateStartTime(e.target.value)}
						onBlur={e => this.blurStartTime(e.target.value)} />
				</Label>
				<Label text="Platser" align="center"><Spinner className="schedule-property" value={this.state.slots} onChange={this.updateSlots} /></Label>
				{allDivisions && allDivisions.map(d =>
					<Label key={d} text={d} align="center"> <input type="checkbox" checked={this.state.selectedDivisions.includes(d)} onChange={e => this.selectDivision(d)} /></Label>)}
				{allDivisions && <Label text="Blanda" align="center"><input type="checkbox" checked={this.state.mixDivisions} onChange={e => this.setState({ mixDivisions: e.target.checked })} /></Label>}
				<Label text="Tid till nästa" align="center"><input className="schedule-property" value={this.state.interval} onChange={this.updateInterval} /></Label>
				<Label text="Tidsåtgång" align="center">
					<input className="schedule-property" value={this.state.duration}
						onChange={e => this.updateDuration(e.target.value)}
						onBlur={e => this.blurDuration(e.target.value)} />
				</Label>
				<Label text="Lägg till" align="center"><button className="button-add green schedule-property" onClick={this.addSquad} /></Label>
			</Toolbar>
			<div className="schedule-table">
				<table className="table-light" style={{ minWidth: rowWidth, maxWidth: rowWidth, width: rowWidth }}>
					<thead>
						<tr>
							<th className="schedule-start-time">Tid</th>
							<th className="schedule-slots">Platser</th>
							{allDivisions && allDivisions.map(d => {
								let w = (d.length + 0.5) + "em";
								return <th key={d} className="schedule-division" style={{ minWidth: w, maxWidth: w, width: w }}>{d}</th>
							})}
							{allDivisions && <th className="schedule-mix">Blanda</th>}
							<th className="schedule-delete">Radera</th>
							<th className="schedule-pad"></th>
						</tr>
					</thead>
					<tbody>
						{this.state.schedule.squads.map(s => <SquadProperties key={s.id} squad={s} divisions={allDivisions} onUpdate={this.updateSquadProperty} onDelete={this.deleteSquad} />)}
					</tbody>
				</table>
			</div>
			<div className="modal-buttons">
				<button className="button white" onClick={this.onDelete}>Radera</button>
				<button className="button" onClick={this.onClose}>OK</button>
			</div>
		</ModalDialog>;
	}
}