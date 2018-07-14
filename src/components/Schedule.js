import './Buttons.css';
import React from 'react';
import { InjectedComponent, Components } from '../logic';

export class Schedule extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { schedule: {} };
		this.inject(Components.Server).loadSchedule(this.inject(Components.Competition).id, this.props.id, json => this.setState({ schedule: json }));
	}

	squadStatus(squad) {
		if (squad.slots === squad.participants.length) { return "full"; }
		if (squad.participants.length === 0) { return "empty"; }
		return "partial";
	}

	renderSquad(squad) {
		let rows = [];
		rows.push(<tr key={squad.time} className={this.squadStatus(squad)}>
			<td>{squad.time}</td>
			<td>{squad.participants.length + "/" + squad.slots}</td>
			<td>
				{squad.participants.length > 0 &&
					<button className={"button medium-round x-large " + (squad.expand ? "arrow-up" : "arrow-down")} onClick={e => { squad.expand = !squad.expand; this.setState({}); }} />}
			</td>
		</tr>);
		if (squad.expand && squad.participants.length > 0) {
			rows = rows.concat(squad.participants.map(p =>
				<tr key={p.id} className="participant">
					<td>{p.name}</td>
					<td>&nbsp;</td>
					<td>{p.division}</td>
				</tr>
			));
		}
		return rows;
	}

	render() {
		return <div className="schedule">
			<h1>Starttider</h1>
			<table>
				<thead></thead>
				<tbody>
					{this.state.schedule.squads && this.state.schedule.squads.map(s => this.renderSquad(s))}
				</tbody>
			</table>
		</div>;
	}
}