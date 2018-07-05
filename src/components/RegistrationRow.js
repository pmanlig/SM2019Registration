import "./Buttons.css";
import React from 'react';
import { InjectedComponent } from '../logic';
import { Dropdown } from './Dropdown';
import { Components } from '.';

export class RegistrationRow extends InjectedComponent {
	eventControls = ({ participant, event }) => {
		if (event.classes && event.divisions) {
			const competition = this.inject(Components.Competition);
			const registration = this.inject(Components.Registration);
			let competitionClass = participant.competitionClass(event.id);
			let classList = competition.classes(event.classes);
			let division = participant.division(event.id);
			let divisionList = competition.divisions(event.divisions);
			return [
				<td key="class"><Dropdown placeholder="Välj klass..." value={competitionClass} items={classList} onChange={e => registration.setParticipantClass(participant.id, event.id, e.target.value)}/></td>,
				<td key="division"><Dropdown placeholder="Välj vapengrupp..." value={division} items={divisionList} onChange={e => registration.setParticipantDivision(participant.id, event.id, e.target.value)}/></td>
			];
		}
		return <td><input type="checkbox" className="checkbox" onChange={c =>
			this.inject(Components.Registration).setParticipantEvent(participant.id, event.id, c.target.checked)
		} checked={participant.participate(event.id)} /></td>;
	}

	registrationControls = ({ participant }) => {
		const EventControls = this.eventControls;
		let result = [];
		this.inject(Components.Competition).eventList().forEach(e => result.push(<EventControls key={e.id} participant={participant} event={e} />));
		return result;
	}

	registrationField = ({ participant, header }) => {
		return <td className="left" key={header.name}><input type="text" value={participant[header.field]}
			placeholder={header.placeholder || header.name} style={{ width: header.width }}
			onChange={e => this.inject(Components.Registration).setParticipantField(participant.id, header.field, e.target.value)}
			size={header.size} /></td>;
	}

	participantFields = ({ participant }) => {
		const RegistrationField = this.registrationField;
		const participantHeader = this.inject(Components.Competition).participantHeader();
		return participantHeader.subFields.map(h => <RegistrationField key={h.field} participant={participant} header={h} />)
	}

	render() {
		const RegistrationControls = this.registrationControls;
		const ParticipantFields = this.participantFields;
		const registration = this.inject(Components.Registration);
		const p = this.props.participant;
		const myId = p.id;
		return <tr key={myId} className={p.errors.length > 0 ? "error" : undefined} >
			<ParticipantFields participant={p} />
			<RegistrationControls participant={p} />
			<td><button className="button small-round deleteButton" onClick={e => registration.deleteParticipant(myId)}>x</button></td></tr>;
	}
}