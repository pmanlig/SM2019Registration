import './Event.css';
import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

export class Event extends Component {
	setTime = (date) => {
		// ToDo: needs to be set in parent to store state info
		this.props.event.date = date;
		this.setState({});
	}

	render() {
		return <div className="event">
			<div className="eventTitle">
				<span>{this.props.event.name}</span>
				{this.props.onDelete && <button className="button-close small deleteButton" onClick={() => this.props.onDelete(this.props.event)} />}
			</div>
			<DatePicker value={this.props.event.date} onChange={this.setTime} />
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