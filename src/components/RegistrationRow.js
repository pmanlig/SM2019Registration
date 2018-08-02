import "./Buttons.css";
import React from 'react';
import { InjectedComponent } from '../logic';
import { Dropdown } from './Dropdown';
import { Components, Events } from '.';

export class RegistrationRow extends InjectedComponent {
	static wire = ["Competition"];

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

	scheduleButtons(participant, event, rounds) {
		let buttons = [];
		for (let i = 0; i < rounds.length; i++) {
			buttons.push(<li key={i}><button className="scheduleButton" onClick={e => this.fire(Events.showSchedule, participant, event)}>Välj starttid ></button></li>);
		}
		return buttons;
	}

	roundButtons(participant, event, rounds, registration) {
		let buttons = [];
		for (let i = 0; i < rounds.length; i++) {
			if (i === 0 && rounds.length < event.maxRegistrations) {
				buttons.push(<li key={i}><button className="button-add small" onClick={e => registration.addParticipantRound(participant, event.id)} /></li>);
			} else if (event.maxRegistrations > 1) {
				buttons.push(<li key={i}><button className="button-close small deleteButton" onClick={e => registration.deleteParticipantRound(participant, event.id, i)} /></li>);
			} else {
				buttons.push(<li key={i}>&nbsp;</li>);
			}
		}
		return buttons;
	}

	EventControls = ({ participant, event }) => {
		const registration = this.inject(Components.Registration);
		const eventInfo = participant.event(event.id) || { event: event.id, rounds: [{}] };
		let controls = [];
		if (event.classes && this.Competition.classes(event.classes)) {
			controls.push(this.classDropdown(participant.id, event.id, eventInfo.class, this.Competition.classes(event.classes), registration));
		}
		if (event.divisions && this.Competition.divisions(event.divisions)) {
			controls.push(<td key="division"><ul>
				{this.divisionDropdown(participant.id, event.id, eventInfo.rounds, this.Competition.divisions(event.divisions), registration)}
			</ul></td>);
		}
		if (event.schedule) {
			controls.push(<td key="schedule"><ul>
				{this.scheduleButtons(participant.id, event.id, eventInfo.rounds, registration)}
			</ul></td>);
		}
		if (event.maxRegistrations > 1) {
			controls.push(<td key="round"><ul>
				{this.roundButtons(participant.id, event, eventInfo.rounds, registration)}
			</ul></td>);
		}

		if (controls.length === 0) {
			controls.push(<td key="participate"><input type="checkbox" className="checkbox" onChange={c =>
				this.inject(Components.Registration).setParticipantEvent(participant.id, event.id, c.target.checked)
			} checked={participant.participate(event.id)} /></td>);
		}

		return controls;
	}

	RegistrationControls = ({ participant }) => {
		let result = [];
		this.Competition.eventList().forEach(e => result.push(<this.EventControls key={e.id} participant={participant} event={e} />));
		return result;
	}

	RegistrationField = ({ participant, header }) => {
		return <td className="left" key={header.name}><input type="text" value={participant[header.field]}
			placeholder={header.placeholder || header.name} style={{ width: header.width }}
			onChange={e => this.inject(Components.Registration).setParticipantField(participant.id, header.field, e.target.value)}
			size={header.size} /></td>;
	}

	ParticipantFields = ({ participant }) => {
		return this.Competition.participantHeader().subFields.map(h => <this.RegistrationField key={h.field} participant={participant} header={h} />)
	}

	render() {
		const registration = this.inject(Components.Registration);
		const p = this.props.participant;
		const myId = p.id;
		return <tr key={myId} className={p.errors.length > 0 ? "error registration" : "registration"} >
			<this.ParticipantFields participant={p} />
			<this.RegistrationControls participant={p} />
			<td><button className="button-close small deleteButton" onClick={e => registration.deleteParticipant(myId)} /></td></tr>;
	}
}