import './RosterView.css';
import React from 'react';
import { Schedule } from '../models';

export class RosterView extends React.Component {
	static register = { name: "RosterView" };
	static wire = ["Competition", "Server", "Footers", "Session", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.state = { events: this.constructEvents(), filter: "" };
		this.loadSchedules();
		this.EventBus.manageEvents(this);
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Startlista för ${this.Competition.name}`);
	}

	constructEvents() {
		let events = this.Competition.events.map(e => {
			return {
				name: e.name !== "" ? e.name : this.Competition.name,
				scheduleId: e.schedule
			}
		}); // .filter(e => e.scheduleId !== undefined);
		if (events.length === 1 && events[0].name === "") events[0].name = this.Competition.name;
		return events;
	}

	loadSchedules = () => {
		this.state.events.forEach(e => {
			if (e.scheduleId === undefined) {
				let i = 0;
				this.Server.loadRoster(this.Competition.id, json => {
					e.schedule = {
						squads: [
							{
								id: i++,
								name: "Deltagare",
								participants: json
							}
						]
					};
					this.setState({});
				}, this.Footers.errorHandler("Kan inte hämta deltagare"));
			} else {
				this.Server.loadSchedule(e.scheduleId, json => {
					this.Server.loadParticipants(e.scheduleId, pJson => {
						e.schedule = Schedule.fromJson(json, pJson);
						this.setState({});
					}, this.Footers.errorHandler("Kan inte hämta deltagare"));
				}, this.Footers.errorHandler("Kan inte hämta schema"));
			}
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

	match = s => {
		return s.toUpperCase().includes(this.state.filter.toUpperCase());
	}

	Participant = ({ participant, key }) => {
		return <div className="rv-participant" key={key} draggable="true" onDragStart={e => {
			if (this.Session.user !== "")
				e.dataTransfer.setData("text/json", JSON.stringify(participant));
		}}>
			<span>{participant.name}, {participant.organization}</span>
			<span>{participant.division}</span>
		</div >;
	}

	Squad = ({ squad, key }) => {
		if (!squad.participants.some(p => this.match(p.name) || this.match(p.organization))) { return null; }
		let header_class = "rv-squad-header";
		let i = 0;
		if (squad.slots !== undefined) {
			if (squad.participants.length > squad.slots) header_class = "rv-squad-header over-capacity";
			if (squad.participants.length === squad.slots) header_class = "rv-squad-header full";
		}
		if (squad === this.state.dropTarget) header_class = "rv-squad-header drop-target";
		return <div className="rv-squad" key={key} onDragOver={e => this.dragOver(e, squad)} onDrop={e => this.moveTo(e.dataTransfer.getData("text/json"), squad.id)}>
			<div className={header_class}>
				{squad.startTime ? <span>{squad.startTime}</span> : <span>{squad.name}</span>}
				{squad.slots && <span>{squad.participants.length}/{squad.slots}</span>}
			</div>
			{squad.participants.filter(p => this.match(p.name) || this.match(p.organization)).map(p => this.Participant({ key: p.id || i++, participant: p }))}
		</div>;
	}

	Event = ({ event, key }) => {
		return <div className="rv-event" key={key}>
			<h3>{event.name}</h3>
			<p className="subtitle">{event.schedule === undefined ? 0 : event.schedule.squads.map(c => c.participants.length).reduce((a, c) => a + c)} starter</p>
			{event.schedule && event.schedule.squads.map(s => this.Squad({ key: s.id, squad: s }))}
		</div>;
	}

	render() {
		return <div id="roster-view" className="content roster">
			<div id="roster-filter">
				<p id="filter-label">Söktext</p>
				<input id="filter-input" value={this.state.filter} onChange={e => this.setState({ filter: e.target.value })} />
			</div>
			{this.state.events.map(e => this.Event({ event: e, key: e.name }))}
		</div>
	}
}