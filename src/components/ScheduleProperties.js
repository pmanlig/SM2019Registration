import './ScheduleProperties.css';
import React from 'react';
import { Time } from '../logic';
import { Schedule } from '../models';
import { ModalDialog } from '../general';
import { ButtonToolbar as Toolbar, Label } from './Toolbar';
import { Spinner } from './Spinner';
import { SquadProperties } from './SquadProperties';

export class ScheduleProperties extends React.Component {
	static register = { name: "ScheduleProperties" };
	static wire = ["Events", "EventBus", "Competition", "Server"];
	schedules = [];

	constructor(props) {
		super(props);
		this.state = {};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.editSchedule, this.editSchedule);
	}

	findDivisions() {
		return (!this.state.event || !this.state.event.divisions) ? undefined :
			this.props.divisionGroups.filter(dg => dg.id === this.state.event.divisions).map(dg => dg.divisions).find(d => { return true; });
	}

	newScheduleInformation(event, schedule) {
		this.schedules[schedule.id] =
			{
				slots: 8,
				startTime: "8:00",
				interval: 10,
				duration: schedule.duration,
				mixDivisions: true,
				selectedDivisions: ((!event || !event.divisions) ? undefined :
					this.props.divisionGroups.filter(dg => dg.id === event.divisions).map(dg => dg.divisions).find(d => { return true; })) || [],
				event: event,
				schedule: schedule
			};
		return this.schedules[schedule.id];
	}

	loadScheduleInformation(event, schedule) {
		let newState = this.schedules[schedule.id] || this.newScheduleInformation(event, schedule);
		newState.duration = schedule.duration;
		this.setState(newState);
	}

	editSchedule = (event) => {
		console.log("Editing schedule " + JSON.stringify(event.schedule));
		// Create new schedule if one doesn't exist
		if (event.schedule === undefined) {
			this.Server.createSchedule(new Schedule().toJson(), schedule => {
				console.log("Schedule created " + JSON.stringify(schedule));
				schedule = Schedule.fromJson(schedule);
				event.schedule = schedule.id;
				this.loadScheduleInformation(event, schedule);
				this.Competition.updateEvent(event);
			});
			return;
		}
		// Test schedule to handle old data format; patch event if old format
		let scheduleId = parseInt(event.schedule, 10);
		if (isNaN(scheduleId)) {
			let schedule = event.schedule;
			event.schedule = schedule.id;
			this.loadScheduleInformation(event, schedule);
			return;
		}
		// Schedule exists; load and show it
		this.Server.loadSchedule(scheduleId, schedule => {
			this.loadScheduleInformation(event, Schedule.fromJson(schedule));
		});
	}

	updateStartTime(t) {
		if (!Time.canSetTime(t)) { return; }
		this.setState({ startTime: t });
	}

	blurStartTime(t) {
		this.setState({ startTime: Time.format(Time.timeFromText(t)) });
	}

	updateSlots = (v) => {
		if (v < 0)
			return;
		let newVal = parseInt(v, 10);
		if (!isNaN(newVal)) {
			this.setState({ slots: newVal });
		}
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
		this.Server.updateSchedule(this.state.schedule.toJson());
	}

	selectDivision = (d) => {
		let divisions = this.state.selectedDivisions;
		this.setState({ selectedDivisions: divisions.includes(d) ? divisions.filter(x => x !== d) : divisions.concat([d]) });
	}

	onClose = () => {
		let schedule = this.state.schedule;
		schedule.duration = this.state.duration;
		this.Server.updateSchedule(schedule.toJson());
		this.setState({ schedule: undefined });
	}

	render() {
		if (this.state.schedule === undefined) { return null; }

		let rowWidth = 11.0;
		let divisions = this.findDivisions();
		if (divisions) { // ToDo: update
			rowWidth += 4;
			divisions.forEach(d => rowWidth += d.length + 0.5);
		}
		rowWidth = rowWidth + "em";
		return <ModalDialog className="schedule-properties" title="Skjutlag/patruller" onClose={this.onClose}>
			<Toolbar className="schedule-tools">
				<Label text="Starttid">
					<input className="schedule-property" value={this.state.startTime} size="5"
						onChange={e => this.updateStartTime(e.target.value)}
						onBlur={e => this.blurStartTime(e.target.value)} />
				</Label>
				<Label text="Platser" align="center"><Spinner className="schedule-property" value={this.state.slots} onChange={this.updateSlots} /></Label>
				{divisions && divisions.map(d =>
					<Label key={d} text={d} align="center"> <input type="checkbox" checked={this.state.selectedDivisions.includes(d)} onChange={e => this.selectDivision(d)} /></Label>)}
				{divisions && <Label text="Blanda" align="center"><input type="checkbox" checked={this.state.mixDivisions} onChange={e => this.setState({ mixDivisions: e.target.checked })} /></Label>}
				<Label text="Tid till nästa" align="center"><input className="schedule-property" value={this.state.interval} onChange={this.updateInterval} /></Label>
				<Label text="Tidsåtgång" align="center">
					<input className="schedule-property" value={this.state.duration}
						onChange={e => this.updateDuration(e.target.value)}
						onBlur={e => this.blurDuration(e.target.value)} />
				</Label>
				<Label text="Lägg till" align="center"><button className="button-add green schedule-property" onClick={this.addSquad} /></Label>
			</Toolbar>
			<div className="schedule-table">
				<table style={{ minWidth: rowWidth, maxWidth: rowWidth, width: rowWidth }}>
					<thead>
						<tr>
							<th className="schedule-start-time">Tid</th>
							<th className="schedule-slots">Platser</th>
							{divisions && divisions.map(d => {
								let w = (d.length + 0.5) + "em";
								return <th key={d} className="schedule-division" style={{ minWidth: w, maxWidth: w, width: w }}>{d}</th>
							})}
							{divisions && <th className="schedule-mix">Blanda</th>}
							<th className="schedule-delete"></th>
							<th className="schedule-pad"></th>
						</tr>
					</thead>
					<tbody>
						{this.state.schedule.squads.map(s => <SquadProperties key={s.id} squad={s} divisions={divisions} onUpdate={this.updateSquadProperty} onDelete={this.deleteSquad} />)}
					</tbody>
				</table>
			</div>
		</ModalDialog>;
	}
}