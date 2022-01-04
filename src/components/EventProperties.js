import './EventProperties.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { Disciplines } from '../models';
import { Spinner, Dropdown, Label } from '.';

export class EventProperties extends React.Component {
	static register = { name: "EventProperties" };
	static wire = ["fire", "subscribe", "Events", "Competition", "Server"];

	constructor(props) {
		super(props);
		this.subscribe(this.Events.competitionUpdated, () => this.setState({}));
	}

	setDiscipline = (event, discipline) => {
		this.Competition.updateEvent(event, "discipline", parseInt(discipline, 10))
	}

	setCost = (event, cost) => {
		cost = parseInt(cost, 10);
		if (!isNaN(cost))
			this.Competition.updateEvent(event, "cost", cost);
	}

	setGroup = (event, property, group) => {
		group = parseInt(group, 10);
		this.Competition.updateEvent(event, property, group === -1 ? undefined : group);
	}

	showSchedule = () => {
		this.fire(this.Events.editSchedule, this.props.event);
	}

	deleteSchedule = () => {
		this.props.event.schedule = undefined;
		this.Competition.updateEvent(this.props.event, "schedule", undefined);
	}

	showStages = () => {
		this.fire(this.Events.editStages, this.props.event);
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
				<Label text="Gren"><Dropdown className="eventProperty" value={event.discipline || -1} list={Disciplines.list} onChange={e => this.setDiscipline(event, e.target.value)} /> </Label>
				<Label text="Antal serier/stationer" align="center"><Spinner className="eventProperty" value={event.scores || 8} onChange={value => this.Competition.updateEvent(event, "scores", Math.max(1, value))} /></Label>
				{(event.discipline === Disciplines.field) &&
					<Label text="Förutsättningar" align="center">
						<button className="eventProperty button" onClick={this.showStages}>Redigera</button>
					</Label>}
				<Label text="Startavgift"><input className="eventProperty" style={{ width: "50px" }} value={event.cost || 100} onChange={e => this.setCost(event, e.target.value)} /></Label>
				<Label text="Klasser"><Dropdown className="eventProperty" value={event.classes || -1} list={this.props.classGroups} onChange={e => this.setGroup(event, "classes", e.target.value)} /></Label>
				<Label text="Vapengrupper"><Dropdown className="eventProperty" value={event.divisions || -1} list={this.props.divisionGroups} onChange={e => this.setGroup(event, "divisions", e.target.value)} /></Label>
				<Label text="Max starter" align="center"><Spinner className="eventProperty" value={event.maxRegistrations || 1} onChange={value => this.Competition.updateEvent(event, "maxRegistrations", Math.max(1, value))} /></Label>
				<Label text="Skjutlag/patruller" align="center">
					<div>
						<button className="eventProperty button" onClick={this.showSchedule}>{event.schedule ? "Redigera" : "Skapa"}</button>
						{event.schedule && <button className="button-close small red event-props-delete" onClick={this.deleteSchedule} />}
					</div>
				</Label>
			</div>
		</div>;
	}
}