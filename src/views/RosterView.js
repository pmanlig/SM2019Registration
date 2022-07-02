import './RosterView.css';
import React from 'react';
import { Permissions, Schedule, TabInfo } from '../models';

export class RosterView extends React.Component {
	static register = { name: "RosterView" };
	static wire = ["Competition", "Server", "Footers", "Session", "EventBus", "Events"];
	static tabInfo = new TabInfo("Startlista", "roster", 3, Permissions.Any);

	static E_CANNOT_LOAD_SCHEDULE = "Kan inte hämta starttider";
	static E_CANNOT_LOAD_PARTICIPANTS = "Kan inte hämta deltagare";

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
				}, this.Footers.errorHandler(RosterView.E_CANNOT_LOAD_PARTICIPANTS));
			} else {
				this.Server.loadSchedule(e.scheduleId, json => {
					this.Server.loadParticipants(e.scheduleId, pJson => {
						let schedule = {};
						Schedule.fromJson(json, pJson).squads.forEach(s => {
							if (schedule[s.startTime] == null) {
								schedule[s.startTime] = s;
							} else {
								schedule[s.startTime].participants = schedule[s.startTime].participants.concat(s.participants);
								schedule[s.startTime].slots += s.slots;
							}
						});
						e.schedule = { squads: Object.values(schedule) };
						this.setState({});
					}, this.Footers.errorHandler(RosterView.E_CANNOT_LOAD_PARTICIPANTS));
				}, this.Footers.errorHandler(RosterView.E_CANNOT_LOAD_SCHEDULE));
			}
		});
	}

	dragStart = (e, participant) => {
		e.dataTransfer.setData("text/json", JSON.stringify(participant));
	}

	dragOver = (ev, squad) => {
		ev.preventDefault();
		this.setState({ dropTarget: squad });
	}

	moveTo = (json, squadId) => {
		let participant = JSON.parse(json);
		// participant = Participant.fromJson({ participant: participant });  Gah!!!  FIX!!!
		participant.dirty = true;
		this.state.events.forEach(e => {
			if (e.schedule) {
				let from = e.schedule.squads.find(s => s.participants.some(p => p.id === participant.id));
				let to = e.schedule.squads.find(s => s.id === squadId);
				if (from && to) {
					from.participants = from.participants.filter(p => p.id !== participant.id);
					to.participants.push(participant);
					from.dirty = true;
					to.dirty = true;
				}
			}
		});
		this.setState({ dropTarget: null });
	}

	saveChanges = () => {
		let changed = [];
		this.state.events.forEach(e => {
			if (e.schedule) {
				e.schedule.squads.forEach(s => {
					if (s.dirty) { changed.push(s) }
				});
			}
		});
		alert(`${changed.length} squads updated`);
		console.log(changed);
	}

	match = s => {
		return s.toUpperCase().includes(this.state.filter.toUpperCase());
	}

	Spacer = props => {
		let style = { gridRow: 1 };
		return [<div key="h1" style={style} />, <div key="h2" style={style} />, <div key="h3" style={style} />];
	}

	Participant = ({ participant }) => {
		return [
			<div className="rv-participant" key="n" draggable={this.Session.user !== "" ? "true" : "false"}
				onDragStart={e => this.dragStart(e, participant)}>{participant.name}</div>,
			<div className="rv-participant" key="o">{participant.organization}</div>,
			<div className="rv-participant rv-class" key="d">{participant.division ? participant.division.replace(/^!/gm, '') : null}</div >];
	}

	SquadHeader = ({ squad }) => {
		let headerClass = "rv-squad-header";
		if (squad.slots !== undefined) {
			if (squad.participants.length > squad.slots) headerClass = "rv-squad-header over-capacity";
			if (squad.participants.length === squad.slots) headerClass = "rv-squad-header full";
		}
		if (squad === this.state.dropTarget) headerClass = "rv-squad-header drop-target";
		return <div className={headerClass}>
			{squad.startTime ? <span>{squad.startTime}</span> : <span>{squad.name}</span>}
			{squad.slots && <span>{squad.participants.length}/{squad.slots}</span>}
		</div>
	}

	Squad = ({ squad }) => {
		let members = squad.participants.filter(p => this.match(p.name) || this.match(p.organization));
		if (members.length === 0) { return null; }
		return <div className="rv-squad" onDragOver={e => this.dragOver(e, squad)} onDrop={e => this.moveTo(e.dataTransfer.getData("text/json"), squad.id)}>
			<this.SquadHeader squad={squad} />
			<div className="rv-squad-list">
				<this.Spacer />
				{members.sort((a, b) => a.position - b.position)
					.flatMap((p, i) => <this.Participant participant={p} key={p.id || i} index={p.id || i} />)}
			</div>
		</div>;
	}

	Event = ({ event }) => {
		return <div className="rv-event">
			<h3>{event.name}</h3>
			<p className="subtitle">{event.schedule === undefined ? 0 : event.schedule.squads.map(c => c.participants.length).reduce((a, c) => a + c, 0)} starter</p>
			{event.schedule && event.schedule.squads.map(s => <this.Squad key={s.id} squad={s} />)}
		</div>;
	}

	render() {
		return <div id="roster-view" className="content roster">
			<div id="roster-filter">
				<p id="filter-label">Söktext</p>
				<input id="filter-input" value={this.state.filter} onChange={e => this.setState({ filter: e.target.value })} />
			</div>
			{this.Session.user !== "" && <button className="globaltool" onClick={this.saveChanges} >Spara</button>}
			{this.state.events.map(e => <this.Event event={e} key={e.name} />)}
		</div>
	}
}