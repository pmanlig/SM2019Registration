import './ScheduleProperties.css';
import React from 'react';
import { ModalDialog } from './Modal';
import { ButtonToolbar as Toolbar, Label } from './Toolbar';
import { Dropdown } from './Dropdown';
import { Spinner } from './Spinner';
import { Schedule, Squad } from '../models';
import { SquadProperties } from './SquadProperties';

export class ScheduleProperties extends React.Component {
	static register = { name: "ScheduleProperties" };

	constructor(props) {
		super(props);
		this.state = {
			slots: 8, startTime: "8:00", interval: 10, divisions: 0, mixDivisions: false, schedule: new Schedule(),
			divisionGroups: [{ id: 0, description: "Inga vapengrupper" }]
		};
	}

	updateStartTime(t) {
		if (!t.toString().match(/^[0-2]?\d?:?[0-5]?\d?$/)) { return; }
		this.setState({ startTime: t });
	}

	blurStartTime(t) {
		let [hrs, mins] = this.state.startTime.split(":");
		hrs = this.pad(hrs, 2);
		mins = mins ? this.pad(mins, 2) : "00";
		this.setState({ startTime: `${hrs}:${mins}` });
	}

	updateSlots = (v) => {
		if (v < 0)
			return;
		let newVal = parseInt(v, 10);
		if (!isNaN(newVal)) {
			this.setState({ slots: newVal });
		}
	}

	updateInterval = (i) => {
		let newInterval = parseInt(i, 10);
		if (isNaN(newInterval)) { return }
		this.setState({ interval: newInterval });
	}

	pad(number, length) {
		return number.toString().length < length ? "0" + number : number;
	}

	formatTime(t) {
		return `${Math.trunc(t / 60)}:${this.pad(t % 60, 2)}`;
	}

	addTime(t, interval) {
		let [hrs, mins] = t.split(":");
		return parseInt(hrs, 10) * 60 + parseInt(mins, 10) + parseInt(interval, 10);
	}

	addSquad() {
		let { startTime, slots, divisions, mixDivisions, schedule, interval } = this.state;
		schedule.addSquad(new Squad(startTime, slots, divisions, mixDivisions));
		this.setState({ startTime: this.formatTime(this.addTime(startTime, interval)) });
		console.log(schedule);
	}

	render() {
		return <ModalDialog title="Skjutlag/patruller" onClose={this.props.onClose}>
			<Toolbar className="schedule-tools">
				<Label text="Starttid">
					<input className="schedule-property" value={this.state.startTime} size="5"
						onChange={e => this.updateStartTime(e.target.value)}
						onBlur={e => this.blurStartTime(e.target.value)} />
				</Label>
				<Label text="Platser" align="center"><Spinner value={this.state.slots} onChange={this.updateSlots} /></Label>
				<Label text="Vapengrupper"><Dropdown className="schedule-property" value={this.state.divisions} list={this.props.divisionGroups || this.state.divisionGroups} /></Label>
				<Label text="Blanda" align="center"><input type="checkbox" value={this.state.mixDivisions} onChange={e => this.setState({ mixDivisions: e.target.value })} /></Label>
				<Label text="Tid till nästa" align="center"><input className="schedule-property" value={this.state.interval} onChange={this.updateInterval} /></Label>
				<Label text="Lägg till skjutlag" align="center"><button className="button-add green" onClick={e => this.addSquad()} /></Label>
			</Toolbar>
			<table className="schedule-table">
				<thead>
				</thead>
				<tbody>
					<tr>
						<th>Tid</th>
						<th>Antal platser</th>
						<th>Vapengrupper</th>
						<th>Blanda</th>
					</tr>
					{this.state.schedule.squads.map(s => <SquadProperties key={s.startTime} squad={s} />)}
				</tbody>
			</table>
		</ModalDialog>;
	}
}