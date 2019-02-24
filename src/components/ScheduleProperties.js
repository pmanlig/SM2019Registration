import './ScheduleProperties.css';
import React from 'react';
import { Time } from '../logic';
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
		this.EventBus.subscribe(this.Events.editSchedule, this.editSchedule);
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
				mixDivisions: true,
				selectedDivisions: ((!event || !event.divisions) ? undefined :
					this.props.divisionGroups.filter(dg => dg.id === event.divisions).map(dg => dg.divisions).find(d => { return true; })) || [],
				event: event,
				schedule: schedule
			};
		return this.schedules[schedule.id];
	}

	loadScheduleInformation(event, schedule) {
		this.setState(this.schedules[schedule.id] || this.newScheduleInformation(event, schedule));
	}

	editSchedule = (event) => {
		// Create new schedule if one doesn't exist		
		if (event.schedule === undefined) {
			this.Server.createSchedule(schedule => {
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
			this.loadScheduleInformation(event, schedule);
		});
	}

	updateStartTime(t) {
		if (!Time.canSetValue(t)) { return; }
		this.setState({ startTime: t });
	}

	blurStartTime(t) {
		this.setState({ startTime: new Time(t).toString() });
	}

	updateSlots = (v) => {
		if (v < 0)
			return;
		let newVal = parseInt(v, 10);
		if (!isNaN(newVal)) {
			this.setState({ slots: newVal });
		}
	}

	updateInterval = (i) => {
		let newInterval = parseInt(i, 10);
		if (isNaN(newInterval)) { return }
		this.setState({ interval: newInterval });
	}

	addSquad = () => {
		let { startTime, slots, selectedDivisions, mixDivisions, interval } = this.state;
		this.state.schedule.addSquad(startTime, slots, selectedDivisions, mixDivisions);
		this.Server.updateSchedule(this.state.schedule.toJson());
		this.setState({ startTime: new Time(startTime).increase(interval).toString() });
	}

	deleteSquad = (s) => {
		this.state.schedule.deleteSquad(s);
		this.Server.updateSchedule(this.state.schedule.toJson());
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
		// ToDo: Save schedule
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
				{divisions && <Label text="Blanda" align="center"><input type="checkbox" checked={this.state.mixDivisions} onChange={e => this.setState({ mixDivisions: e.target.value })} /></Label>}
				<Label text="Tid till nästa" align="center"><input className="schedule-property" value={this.state.interval} onChange={this.updateInterval} /></Label>
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