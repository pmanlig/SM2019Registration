import './EventInfo.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { InjectedComponent, Components } from '../logic';

export class EventInfo extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	setEventProperty = (event, property) => {
		this.setState({ event: event, property: property });
	}

	setGroup = cg => {
		let competition = this.inject(Components.Competition);
		competition.updateEvent(this.state.event, this.state.property, cg ? cg.description : undefined);
		this.setState({ event: undefined, property: undefined });
	}

	render() {
		let { event } = this.props;
		let competition = this.inject(Components.Competition);
		let onDelete = competition.events.length > 1 ? e => competition.removeEvent(e) : undefined;
		const ClassPicker = this.inject(Components.ClassPicker);
		const DivisionPicker = this.inject(Components.DivisionPicker);
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small deleteButton" onClick={() => onDelete(event)} />}
			</div>
			<DatePicker value={event.date} onChange={d => competition.updateEvent(event, "date", d)} />
			<div className="eventProperty">
				<button className="eventInfo" onClick={e => this.setEventProperty(event, "classes")}>{event.classes || "Ingen klassindelning"}</button>
				{this.state.property === "classes" && <ClassPicker action={this.setGroup} />}
			</div>
			<div className="eventProperty">
				<button className="eventInfo" onClick={e => this.setEventProperty(event, "divisions")}>{event.divisions || "Inget val av vapengrupp"}</button>
				{this.state.property === "divisions" && <DivisionPicker action={this.setGroup} />}
			</div>
			<button className="eventInfo" onClick={e => this.setEventProperty(event, "schedule")}>
				{event.schedule || "Inget val av starttid"}
			</button>
		</div>;
	}
}