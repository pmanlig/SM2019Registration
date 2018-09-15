import React from 'react';
import { Time } from '../logic';

export class SquadProperties extends React.Component {
	updateSquadProperty(property, value) {
		this.props.onUpdate(this.props.squad.id, property, value);
		this.setState({});
	}

	selectDivision = d => {
		let n = this.props.squad.divisions;
		this.updateSquadProperty("divisions", n.includes(d) ? n.filter(x => x !== d) : n.concat([d]));
		this.setState({});
	}

	changeSlots = n => {
		if (n !== "" && !n.match(/^\d*$/)) { return; }
		this.updateSquadProperty("slots", parseInt(n, 10));
		this.setState({});
	}

	changeStartTime = t => {
		if (!Time.canSetValue(t)) { return; }
		this.updateSquadProperty("startTime", t);
		this.setState({});
	}

	onTimeBlur = () => {
		this.updateSquadProperty("startTime", new Time(this.props.squad.startTime).toString());
		this.setState({});
	}

	render() {
		let { startTime, slots, mixed } = this.props.squad;
		let selectedDivisions = this.props.squad.divisions;
		let divisions = this.props.divisions;
		return <tr>
			<td className="schedule-start-time"><input className="inplace-edit schedule-start-time" value={startTime} onChange={e => this.changeStartTime(e.target.value)} onBlur={this.onTimeBlur} /></td>
			<td className="schedule-slots"><input className="inplace-edit schedule-slots" value={slots} onChange={e => this.changeSlots(e.target.value)} /></td>
			{divisions && divisions.map(d => {
				let w = (d.length + 0.5) + "em";
				return <td key={d} className="schedule-division" style={{ minWidth: w, maxWidth: w, width: w }}>
					<input type="checkbox" checked={selectedDivisions.includes(d)} onChange={x => this.selectDivision(d)} />
				</td>
			})}
			{divisions && <td className="schedule-mix"><input type="checkbox" checked={mixed} onChange={e => this.updateSquadProperty("mixed", e.target.checked)} /></td>}
			<td className="schedule-delete"><button className="button-close small red" onClick={e => this.props.onDelete(this.props.squad)} /></td>
			<td className="schedule-pad"></td>
		</tr >;
	}
}