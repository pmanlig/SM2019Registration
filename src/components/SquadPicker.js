import './SquadPicker.css';
import React from 'react';

export class SquadPicker extends React.Component {
	static register = { name: "SquadPicker" };
	static wire = ["Competition"];

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
		let schedule = this.props.schedule;
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
					{schedule.squads && schedule.squads.map(s => this.renderSquad(s))}
				</tbody>
			</table>
		</div>;
	}
}