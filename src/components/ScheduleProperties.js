import './ScheduleProperties.css';
import React from 'react';
import { Time } from '../logic';
import { ModalDialog } from '../general';
import { ButtonToolbar as Toolbar, Label } from './Toolbar';
import { Spinner } from './Spinner';
import { SquadProperties } from './SquadProperties';

export class ScheduleProperties extends React.Component {
	static register = { name: "ScheduleProperties" };
	static wire = ["Server"];

	constructor(props) {
		super(props);
		this.state = {
			slots: 8, startTime: "8:00", interval: 10, mixDivisions: true, selectedDivisions: this.props.divisions ? this.props.divisions.divisions : []
		};
	}

	updateStartTime(t) {
		if (!Time.canSetValue(t)) { return; }
		this.setState({ startTime: t });
	}

	blurStartTime(t) {
		this.setState({ startTime: new Time(t).toString() });
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

	addSquad = () => {
		let { startTime, slots, selectedDivisions, mixDivisions, interval } = this.state;
		this.props.schedule.addSquad(startTime, slots, selectedDivisions, mixDivisions);
		this.Server.updateSchedule(this.props.schedule);
		this.setState({ startTime: new Time(startTime).increase(interval).toString() });
	}

	deleteSquad = (s) => {
		this.props.schedule.deleteSquad(s);
		this.Server.updateSchedule(this.props.schedule);
		this.setState({});
	}

	updateSquadProperty = (id, property, value) => {
		this.props.schedule.updateSquadProperty(id, property, value);
		this.Server.updateSchedule(this.props.schedule);
	}

	selectDivision = (d) => {
		let divisions = this.state.selectedDivisions;
		this.setState({ selectedDivisions: divisions.includes(d) ? divisions.filter(x => x !== d) : divisions.concat([d]) });
	}

	render() {
		let rowWidth = 11.0;
		if (this.props.divisions) {
			rowWidth += 4;
			this.props.divisions.divisions.forEach(d => rowWidth += d.length + 0.5);
		}
		rowWidth = rowWidth + "em";
		return <ModalDialog className="schedule-properties" title="Skjutlag/patruller" onClose={this.props.onClose}>
			<Toolbar className="schedule-tools">
				<Label text="Starttid">
					<input className="schedule-property" value={this.state.startTime} size="5"
						onChange={e => this.updateStartTime(e.target.value)}
						onBlur={e => this.blurStartTime(e.target.value)} />
				</Label>
				<Label text="Platser" align="center"><Spinner className="schedule-property" value={this.state.slots} onChange={this.updateSlots} /></Label>
				{this.props.divisions && this.props.divisions.divisions.map(d =>
					<Label key={d} text={d} align="center"> <input type="checkbox" checked={this.state.selectedDivisions.includes(d)} onChange={e => this.selectDivision(d)} /></Label>)}
				{this.props.divisions && <Label text="Blanda" align="center"><input type="checkbox" checked={this.state.mixDivisions} onChange={e => this.setState({ mixDivisions: e.target.value })} /></Label>}
				<Label text="Tid till nästa" align="center"><input className="schedule-property" value={this.state.interval} onChange={this.updateInterval} /></Label>
				<Label text="Lägg till" align="center"><button className="button-add green schedule-property" onClick={this.addSquad} /></Label>
			</Toolbar>
			<div className="schedule-table">
				<table style={{ minWidth: rowWidth, maxWidth: rowWidth, width: rowWidth }}>
					<thead>
						<tr>
							<th className="schedule-start-time">Tid</th>
							<th className="schedule-slots">Platser</th>
							{this.props.divisions && this.props.divisions.divisions.map(d => {
								let w = (d.length + 0.5) + "em";
								return <th key={d} className="schedule-division" style={{ minWidth: w, maxWidth: w, width: w }}>{d}</th>
							})}
							{this.props.divisions && <th className="schedule-mix">Blanda</th>}
							<th className="schedule-delete"></th>
							<th className="schedule-pad"></th>
						</tr>
					</thead>
					<tbody>
						{this.props.schedule.squads.map(s => <SquadProperties key={s.id} squad={s} divisions={this.props.divisions} onUpdate={this.updateSquadProperty} onDelete={this.deleteSquad} />)}
					</tbody>
				</table>
			</div>
		</ModalDialog>;
	}
}