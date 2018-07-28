import './Event.css';
import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

export class Event extends Component {
	// ToDo: needs to be set in competition object so changes are saved
	updateProperty(prop, value) {
		this.props.event[prop] = value;
		this.setState({});
	}

	render() {
		return <div className="event">
			<div className="eventTitle">
				{this.props.onDelete && <input value={this.props.event.name} size="20" onChange={e => this.updateProperty("name", e.target.value)} />}
				{this.props.onDelete && <button className="button-close small deleteButton" onClick={() => this.props.onDelete(this.props.event)} />}
			</div>
			<DatePicker value={this.props.event.date} onChange={d => this.updateProperty("date", d)} />
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