import React, {Component} from 'react';

export class RegistrationRow extends Component {
	render() {
		var fieldId = 0;
		return <tr key={this.props.participant.id}>
			<td><input type="text" value={this.props.participant.name} /></td>
			<td><input type="text" value={this.props.participant.competitionId} /></td>
			<td><input type="text" value={this.props.participant.organization} /></td>
			{this.props.participant.registrationInfo.map((cell) => { return (<td key={fieldId++}><input type="checkbox" value={cell} /></td>) })}
			<td><button onClick={(e) => this.props.registration.deleteParticipant(this.props.participant.id)}>X</button></td></tr>;
	}
}