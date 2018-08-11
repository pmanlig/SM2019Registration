import React from 'react';

export class SquadProperties extends React.Component {
	render() {
		let { startTime, slots, divisions, mixDivisions } = this.props.squad;
		return <tr>
			<td>{startTime}</td>
			<td>{slots}</td>
			<td>{divisions}</td>
			<td><input type="checkbox" value={mixDivisions} onChange={e => { mixDivisions = e.target.value; this.setState({}) }} /></td>
			<td><button className="button-close small red" onClick={e => this.props.onDelete(this.props.squad)} /></td>
			<td></td>
		</tr>;
	}
}