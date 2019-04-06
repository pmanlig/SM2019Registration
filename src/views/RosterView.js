import './RosterView.css';
import React from 'react';
import { Schedule } from '../models';

export class RosterView extends React.Component {
	static register = { name: "RosterView" };
	static wire = ["Competition", "Server", "Footers"];

	constructor(props) {
		super(props);
		this.state = { events: this.constructEvents() };
		this.loadSchedules();
	}

	constructEvents() {
		let events = this.Competition.events.map(e => {
			return {
				name: e.name,
				scheduleId: e.schedule
			}
		}).filter(e => e.scheduleId !== undefined);
		if (events.length === 1 && events[0].name === "") events[0].name = this.Competition.name;
		return events;
	}

	loadSchedules = () => {
		this.state.events.forEach(e => {
			this.Server.loadSchedule(e.scheduleId, json => {
				this.Server.loadParticipants(e.scheduleId, pJson => {
					e.schedule = Schedule.fromJson(json, pJson);
					this.setState({});
				}, this.Footers.errorHandler("Kan inte hämta deltagare"));
			}, this.Footers.errorHandler("Kan inte hämta schema"));
		});
	}

	dragOver = (ev, squad) => {
		ev.preventDefault();
		this.setState({ dropTarget: squad });
	}

	moveTo = (json, squadId) => {
		let participant = JSON.parse(json);
		this.state.events.forEach(e => {
			if (e.schedule) {
				e.schedule.squads.forEach(s => {
					s.participants = s.participants.filter(p => p.id !== participant.id);
					if (s.id === squadId) {
						s.participants.push(participant);
					}
				});
			}
		});
		this.setState({ dropTarget: null });
	}

	Participant = ({ participant }) => {
		return <div className="rv-participant" draggable="true" onDragStart={e => e.dataTransfer.setData("text/json", JSON.stringify(participant))}>
			{participant.name}, {participant.organization}
		</div>;
	}

	Squad = ({ squad }) => {
		// if (squad.participants.length === 0) return null;
		return <div className="rv-squad" onDragOver={e => this.dragOver(e, squad)} onDrop={e => this.moveTo(e.dataTransfer.getData("text/json"), squad.id)}>
			<div className={squad === this.state.dropTarget ? "rv-squad-header drop-target" : "rv-squad-header"}>{squad.startTime}</div>
			{squad.participants.map(p => <this.Participant key={p.id} participant={p} />)}
		</div>;
	}

	Event = ({ event }) => {
		return <div className="rv-event">
			<h3>{event.name}</h3>
			{event.schedule && event.schedule.squads.map(s => <this.Squad key={s.id} squad={s} />)}
		</div>;
	}

	render() {
		return <div className="content roster">
			{this.state.events.map(e => <this.Event event={e} key={e.name} />)}
		</div>
	}
}