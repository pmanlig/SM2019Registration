import './EventProperties.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { Spinner, Dropdown, Label } from '.';

export class EventProperties extends React.Component {
	static register = { name: "EventProperties" };
	static wire = ["fire", "Events", "Competition", "ScheduleProperties", "Server"];

	constructor(props) {
		super(props);
		this.state = { showSchedule: false };
	}

	setGroup = (event, property, group) => {
		this.Competition.updateEvent(event, property, group === -1 ? undefined : group);
	}

	showSchedule() {
		console.log("Displaying schedule");
		console.log(this.props.event);

		let callback = s => {
			this.props.event.schedule = s;
			this.fire(this.Events.competitionUpdated);
			this.setState({ showSchedule: true });
		}

		if (this.props.event.schedule === undefined) {
			this.Server.createSchedule(callback);
		} else {
			let scheduleId = parseInt(this.props.event.schedule, 10);
			if (!isNaN(scheduleId)) {
				this.Server.loadSchedule(scheduleId, callback);
			} else {
				this.setState({ showSchedule: true });
			}
		}
	}

	render() {
		let { event } = this.props;
		let onDelete = this.Competition.events.length > 1 ? e => this.Competition.removeEvent(e) : undefined;
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => this.Competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small red" onClick={() => onDelete(event)} />}
			</div>
			<div className="eventProperties">
				<Label text="Datum"><DatePicker value={event.date} onChange={d => this.Competition.updateEvent(event, "date", d)} /></Label>
				<Label text="Klasser"><Dropdown className="eventProperty" value={event.classes || -1} list={this.props.classGroups} onChange={e => this.setGroup(event, "classes", e.target.value)} /></Label>
				<Label text="Vapengrupper"><Dropdown className="eventProperty" value={event.divisions || -1} list={this.props.divisionGroups} onChange={e => this.setGroup(event, "divisions", e.target.value)} /></Label>
				<Label text="Max starter" align="center"><Spinner className="eventProperty" value={event.maxRegistrations || 1} onChange={value => this.Competition.updateEvent(event, "maxRegistrations", Math.max(1, value))} /></Label>
				<Label text="Skjutlag/patruller" align="center"><button className="eventProperty button" onClick={e => this.showSchedule()}>{event.schedule ? "Redigera" : "Skapa"}</button></Label>
				{this.state.showSchedule && <this.ScheduleProperties divisionGroups={this.props.divisionGroups} schedule={event.schedule} onClose={e => this.setState({ showSchedule: false })} />}
			</div>
		</div>;
	}
}