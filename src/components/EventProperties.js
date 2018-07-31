import './EventProperties.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { InjectedComponent, Components } from '../logic';
import { Spinner, Dropdown } from '.';

function withLabel(label, Prop, boxClass) {
	return (props) => {
		return <div className={"labelBox " + boxClass}>
			<p>{label}</p>
			<Prop {...props} />
		</div>;
	}
}

export class EventProperties extends InjectedComponent {
	setGroup = (event, property, group) => {
		this.inject(Components.Competition).updateEvent(event, property, group === -1 ? undefined : group);
	}

	render() {
		let { event } = this.props;
		let competition = this.inject(Components.Competition);
		let onDelete = competition.events.length > 1 ? e => competition.removeEvent(e) : undefined;
		const DatePick = withLabel("Datum", DatePicker);
		const ClassPicker = withLabel("Klasser", Dropdown);
		const DivisionPicker = withLabel("Vapengrupper", Dropdown);
		const Spin = withLabel("Starter", Spinner, "center");
		const ScheduleProperties = withLabel("Skjutlag/patruller", props => <button {...props} />);
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small deleteButton" onClick={() => onDelete(event)} />}
			</div>
			<div className="eventProperties">
				<DatePick value={event.date} onChange={d => competition.updateEvent(event, "date", d)} />
				<ClassPicker className="eventProperty" value={event.classes || -1} list={this.props.classGroups} onChange={e => this.setGroup(event, "classes", e.target.value)} />
				<DivisionPicker className="eventProperty" value={event.divisions || -1} list={this.props.divisionGroups} onChange={e => this.setGroup(event, "divisions", e.target.value)} />
				<Spin className="eventProperty" value={event.maxRegistrations || 1} onChange={value => competition.updateEvent(event, "maxRegistrations", Math.max(1, value))} />
				<ScheduleProperties className="eventProperty" onClick={e => competition.updateEvent(event, "schedule", undefined)}>{event.schedule || "Skapa"}</ScheduleProperties>
			</div>
		</div>;
	}
}