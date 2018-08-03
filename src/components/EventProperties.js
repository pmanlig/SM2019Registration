import './EventProperties.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { Spinner, Dropdown } from '.';

export class EventProperties extends React.Component {
	static register = true;
	static wire = ["Competition"];

	withLabel(label, Prop, boxClass) {
		return (props) => {
			return <div className={"labelBox " + boxClass}>
				<p>{label}</p>
				<Prop {...props} />
			</div>;
		}
	}

	setGroup = (event, property, group) => {
		this.Competition.updateEvent(event, property, group === -1 ? undefined : group);
	}

	render() {
		let { event } = this.props;
		let onDelete = this.Competition.events.length > 1 ? e => this.Competition.removeEvent(e) : undefined;
		const DatePick = this.withLabel("Datum", DatePicker);
		const ClassPicker = this.withLabel("Klasser", Dropdown);
		const DivisionPicker = this.withLabel("Vapengrupper", Dropdown);
		const Spin = this.withLabel("Starter", Spinner, "center");
		const ScheduleProperties = this.withLabel("Skjutlag/patruller", props => <button {...props} />);
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => this.Competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small deleteButton" onClick={() => onDelete(event)} />}
			</div>
			<div className="eventProperties">
				<DatePick value={event.date} onChange={d => this.Competition.updateEvent(event, "date", d)} />
				<ClassPicker className="eventProperty" value={event.classes || -1} list={this.props.classGroups} onChange={e => this.setGroup(event, "classes", e.target.value)} />
				<DivisionPicker className="eventProperty" value={event.divisions || -1} list={this.props.divisionGroups} onChange={e => this.setGroup(event, "divisions", e.target.value)} />
				<Spin className="eventProperty" value={event.maxRegistrations || 1} onChange={value => this.Competition.updateEvent(event, "maxRegistrations", Math.max(1, value))} />
				<ScheduleProperties className="eventProperty" onClick={e => this.Competition.updateEvent(event, "schedule", undefined)}>{event.schedule || "Skapa"}</ScheduleProperties>
			</div>
		</div>;
	}
}