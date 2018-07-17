import './Buttons.css';
import React, { Component } from 'react';
import { Event } from '.';

export class EventList extends Component {
	render() {
		return <div>
			{this.props.events.map(e => <Event key={e.name} event={e} onDelete={this.props.removeEvent} />)}
			<div className="addEvent">
				<input type="text" size="25" placeholder="Namn på ny deltävling" ref={input => this.newEventName = input} />
				<button className="button-add small addEventButton" onClick={() => this.props.addEvent(this.newEventName.value)} />
			</div>
		</div>;
	}
}