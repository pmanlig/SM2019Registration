import './SquadPicker.css';
import React from 'react';

export class SquadPicker extends React.Component {
	static register = { name: "SquadPicker" };
	static wire = ["EventBus", "Events", "Server", "Competition"];

	constructor(props) {
		super(props);
		this.state = {};
		this.EventBus.manageEvents(this);
		this.EventBus.subscribe(this.Events.showSchedule, this.showSchedule);
	}

	showSchedule = (participant, event, round) => {
		this.Server.loadSchedule(event.schedule, json => {
			console.log("Showing Schedule");
			console.log(json);
			this.setState({ event: event, schedule: json, participant: participant, round: round });
		});
	}

	selectSquad = (squad) => {
		// this.state.participant.addSquad(this.state.event, squad, this.state.round);
		this.setState({ schedule: undefined });
	}

	squadStatus(squad) {
		if (squad.slots === squad.participants.length) { return "full"; }
		if (squad.participants.length === 0) { return "empty"; }
		return "partial";
	}

	renderSquad(squad) {
		let rows = [];
		rows.push(<tr key={squad.id} className={this.squadStatus(squad)} onClick={e => this.props.onSelect(squad)}>
			<td className="time">{squad.startTime}</td>
			<td>{`${squad.participants.length} / ${squad.slots}`}</td>
			<td>
				{squad.participants.length > 0 &&
					<button className={(squad.expand ? "button-collapse small" : "button-expand small")} onClick={e => { squad.expand = !squad.expand; this.setState({}); }} />}
			</td>
		</tr>);
		if (squad.expand && squad.participants.length > 0) {
			rows = rows.concat(squad.participants.map(p =>
				<tr key={p.id} className="participant">
					<td className="time">{p.name}</td>
					<td>&nbsp;</td>
					<td>{p.division}</td>
				</tr>
			));
		}
		return rows;
	}

	render() {
		let schedule = this.state.schedule;
		// if (schedule === undefined) { return null; }

		return <div className="squad-picker">
			<h1>Starttider</h1>
			<table>
				<thead>
					<tr>
						<th className="time">Tid</th>
						<th>Platser</th>
					</tr>
				</thead>
				<tbody>
					{schedule && schedule.squads && schedule.squads.map(s => this.renderSquad(s))}
				</tbody>
			</table>
		</div>;
	}
}