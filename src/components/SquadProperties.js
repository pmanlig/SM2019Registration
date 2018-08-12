import React from 'react';

export class SquadProperties extends React.Component {
	updateSquadProperty(property, value) {
		this.props.onUpdate(this.props.squad.id, property, value);
		this.setState({});
	}

	render() {
		let { startTime, slots, divisions, mixed } = this.props.squad;
		return <tr>
			<td>{startTime}</td>
			<td>{slots}</td>
			<td>{divisions}</td>
			<td><input type="checkbox" checked={mixed} onChange={e => this.updateSquadProperty("mixed", e.target.checked)} /></td>
			<td><button className="button-close small red" onClick={e => this.props.onDelete(this.props.squad)} /></td>
			<td></td>
		</tr>;
	}
}