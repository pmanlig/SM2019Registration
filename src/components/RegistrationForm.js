import './Registration.css';
import React from 'react';
import { Components, Events } from '.';
import { InjectedComponent } from '../logic';

const personHeader = {
	name: 'Skytt', subFields: [
		{ name: 'Namn', field: 'name', width: 200, type: 'text' },
		{ name: 'Pistolskyttekort', field: 'competitionId', size: '5', placeholder: '00000', width: 40, type: 'number' },
		{ name: 'Förening', field: 'organization', width: 200, type: 'text' }]
};

export class RegistrationForm extends InjectedComponent {
	addMinorHeadersFor(event, minorHeaders) {
		if (!event.divisions) {
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry vert"><div>{event.name}</div></th>);
			return;
		}
		if (event.classes) {
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry">Klass</th>);
		}
		if (event.divisions) {
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry">Vapengrupp</th>);
		}
		if (event.maxRegistrations > 1) {
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry" style={{ width: "20px" }}>&nbsp;</th>);
		}
		// ToDo: Handle schedule
	}

	RegistrationHeader({ competition }) {
		const majorHeaders = [<th key="-1" className="major" colSpan={personHeader.subFields.length}>{personHeader.name}</th>];
		const minorHeaders = [];

		personHeader.subFields.forEach(s => {
			minorHeaders.push(<th key={minorHeaders.length} style={{ width: s.width, paddingRight: 10, verticalAlign: "bottom" }} className="minor">{s.name}</th>);
		});

		competition.eventGroups.forEach(group => {
			let initial = minorHeaders.length;
			competition.eventList(group.id).forEach(e => this.addMinorHeadersFor(e, minorHeaders));
			majorHeaders.push(<th key={group.id} className="major" colSpan={minorHeaders.length - initial}>{group.name}</th>);
		});
		return (
			<thead>
				<tr>{majorHeaders}</tr>
				<tr>{minorHeaders}</tr>
			</thead>
		);
	}

	RegistrationControls({ participant, competition, inject }) {
		let result = [];
		competition.eventList().forEach(e => result.push(<td key={e.id}><input type="checkbox" className="checkbox" onChange={c =>
			inject(Components.Registration).setParticipantDivision(participant.id, e.id, c.target.checked)
		} checked={participant.participate(e.id)} /></td>));
		return result;
	}

	RegistrationField({ id, participant, header, fire }) {
		return <td className="left" key={header.name}><input type="text" value={participant[header.field]}
			placeholder={header.placeholder || header.name} style={{ width: header.width }}
			onChange={e => fire(Events.setParticipantField, id, header.field, e.target.value)}
			size={header.size} /></td>;
	}

	RegistrationRow(props) {
		const RegistrationField = this.RegistrationField.bind(this);
		const RegistrationControls = this.RegistrationControls.bind(this);
		const registration = this.inject(Components.Registration);
		const p = props.participant;
		const myId = p.id;
		return <tr key={myId} style={{ background: p.errors.length > 0 ? "red" : "white" }}>
			{personHeader.subFields.map(h => <RegistrationField key={h.field} id={myId} participant={p} header={h} {...props} />)}
			<RegistrationControls {...props} />
			<td><button className="deleteButton button" onClick={e => registration.deleteParticipant(myId)}>x</button></td></tr>;
	}

	RegistrationRows(props) {
		const RegistrationRow = this.RegistrationRow.bind(this);
		return <tbody>{props.participants.map(
			p => <RegistrationRow key={p.id} participant={p} {...props} />
		)}</tbody>;
	}

	render() {
		const RegistrationRows = this.RegistrationRows.bind(this);
		const RegistrationHeader = this.RegistrationHeader.bind(this);
		return <div id='registration' className='content'>
			<table>
				<RegistrationHeader {...this.props} />
				<RegistrationRows {...this.props} />
			</table>
		</div>;
	}
}