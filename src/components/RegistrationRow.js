import "./Buttons.css";
import React from 'react';
import { InjectedComponent } from '../logic';
import { Dropdown } from './Dropdown';
import { Components } from '.';

export class RegistrationRow extends InjectedComponent {
	classDropdown(participant, event, value, values, registration) {
		return <td key="class"><Dropdown placeholder="Välj klass..." value={value} items={values} onChange={e => registration.setParticipantClass(participant, event, e.target.value)} /></td>;
	}

	divisionDropdown(participant, event, rounds, values, registration) {
		let dropdowns = [];
		for (let i = 0; i < rounds.length; i++) {
			dropdowns.push(<li key={i}><Dropdown placeholder="Välj vapengrupp..." value={rounds[i].division} items={values} onChange={e => registration.setParticipantDivision(participant, event, i, e.target.value)} /></li>);
		}
		return dropdowns;
	}

	scheduleButtons(participant, event, rounds, registration) {
		let buttons = [];
		for (let i = 0; i < rounds.length; i++) {
			buttons.push(<li key={i}><button>Välj starttid ></button></li>);
		}
		return buttons;
	}

	eventControls = ({ participant, event }) => {
		const competition = this.inject(Components.Competition);
		const registration = this.inject(Components.Registration);
		const eventInfo = participant.event(event.id) || { event: event.id, rounds: [{}] };
		let controls = [];
		if (event.classes) {
			controls.push(this.classDropdown(participant.id, event.id, eventInfo.class, competition.classes(event.classes), registration));
		}
		if (event.divisions) {
			controls.push(<td key="division"><ul>
				{this.divisionDropdown(participant.id, event.id, eventInfo.rounds, competition.divisions(event.divisions), registration)}
			</ul></td>);
		}
		if (event.schedule) {
			controls.push(<td key="schedule"><ul>
				{this.scheduleButtons(participant.id, event.id, eventInfo.rounds, registration)}
			</ul></td>);
		}
		if (eventInfo.rounds.length < event.maxRegistrations) {
			controls.push(<td key="addRound"><button onClick={e => registration.addParticipantRound(participant.id, event.id)}>+</button></td>);
		}

		if (controls.length === 0) {
			controls.push(<td><input type="checkbox" className="checkbox" onChange={c =>
				this.inject(Components.Registration).setParticipantEvent(participant.id, event.id, c.target.checked)
			} checked={participant.participate(event.id)} /></td>);
		}

		return controls;
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
		return <tr key={myId} className={p.errors.length > 0 ? "error registration" : "registration"} >
			<ParticipantFields participant={p} />
			<RegistrationControls participant={p} />
			<td><button className="button small-round deleteButton" onClick={e => registration.deleteParticipant(myId)}>x</button></td></tr>;
	}
}