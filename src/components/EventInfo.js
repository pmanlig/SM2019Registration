import './EventInfo.css';
import React from 'react';
import DatePicker from 'react-date-picker';
import { InjectedComponent, Components } from '../logic';
import { Dropdown } from '.';

export class EventInfo extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {
			classGroups: [{ id: -1, description: "Ingen klassindelning" }],
			divisionGroups: [{ id: -1, description: "Inget val av vapengrupp" }]
		};
		let server = this.inject(Components.Server);
		server.loadClassGroups(list => this.setState({ classGroups: this.state.classGroups.concat(list) }));
		server.loadDivisionGroups(list => this.setState({ divisionGroups: this.state.divisionGroups.concat(list) }));
	}

	setGroup = (event, property, group) => {
		this.inject(Components.Competition).updateEvent(event, property, group === -1 ? undefined : group);
	}

	render() {
		let { event } = this.props;
		let competition = this.inject(Components.Competition);
		let onDelete = competition.events.length > 1 ? e => competition.removeEvent(e) : undefined;
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small deleteButton" onClick={() => onDelete(event)} />}
			</div>
			<DatePicker value={event.date} onChange={d => competition.updateEvent(event, "date", d)} />
			<Dropdown className="eventProperty" value={event.classes || -1} list={this.state.classGroups} onChange={e => this.setGroup(event, "classes", e.target.value)} />
			<Dropdown className="eventProperty" value={event.divisions || -1} list={this.state.divisionGroups} onChange={e => this.setGroup(event, "divisions", e.target.value)} />
			<button className="eventProperty" onClick={e => this.setEventProperty(event, "schedule")}>{event.schedule || "Skapa skjutlag/patruller"}</button>
		</div>;
	}
}