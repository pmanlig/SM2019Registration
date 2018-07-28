import './Event.css';
import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

export class Event extends Component {
	render() {
		let { event, competition, onDelete } = this.props;
		return <div className="event">
			<div className="eventTitle">
				{onDelete && <input value={event.name} size="20" onChange={e => competition.updateEvent(event, "name", e.target.value)} />}
				{onDelete && <button className="button-close small deleteButton" onClick={() => onDelete(event)} />}
			</div>
			<DatePicker value={event.date} onChange={d => competition.updateEvent(event, "date", d)} />
			<select className="eventInfo">
				<option value="none">Inget schema</option>
				<option value="none">Nytt schema...</option>
			</select>
			<select className="eventInfo">
				<option value="none">Inga vapengrupper</option>
				<option value="none">Ny indelning...</option>
			</select>
			<select className="eventInfo">
				<option value="none">Ingen klassindelning</option>
				<option value="none">Ny indelning...</option>
			</select>
		</div>;
	}
}