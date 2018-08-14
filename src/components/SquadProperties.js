import React from 'react';

export class SquadProperties extends React.Component {
	updateSquadProperty(property, value) {
		this.props.onUpdate(this.props.squad.id, property, value);
		this.setState({});
	}

	render() {
		let { startTime, slots, mixed } = this.props.squad;
		let divisions = this.props.divisions;
		return <tr>
			<td className="schedule-start-time">{startTime}</td>
			<td className="schedule-slots">{slots}</td>
			{divisions && divisions.divisions.map(d => <td key={d} className="schedule-division"><input type="checkbox" /></td>)}
			<td className="schedule-mix"><input type="checkbox" checked={mixed} onChange={e => this.updateSquadProperty("mixed", e.target.checked)} /></td>
			<td className="schedule-delete"><button className="button-close small red" onClick={e => this.props.onDelete(this.props.squad)} /></td>
			<td className="schedule-pad"></td>
		</tr>;
	}
}