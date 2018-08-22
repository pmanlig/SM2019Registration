import React from 'react';
import { Dropdown } from './Dropdown';

export class RegistrationRow extends React.Component {
	static register = { name: "RegistrationRow" };
	static wire = ["fire", "Competition", "Registration", "Events"];

	classDropdown(numRows, participantId, event, value, values) {
		return <td key={`c${event.id}`} rowSpan={numRows}>
			<Dropdown placeholder="Välj klass..." value={value} list={values.map(v => { return { id: v, description: v } })}
				onChange={e => this.Registration.setParticipantClass(participantId, event, e.target.value)} />
		</td>;
	}

	divisionDropdown(row, participantId, event, rounds, values) {
		return <td key={`d${event.id}${row}`} className="division">
			{row < rounds.length && <Dropdown placeholder="Välj vapengrupp..." value={rounds[row].division} list={values.map(v => { return { id: v, description: v } })}
				onChange={e => this.Registration.setParticipantDivision(participantId, event, row, e.target.value)} />}
		</td>;
	}

	scheduleButton(row, participantId, event, rounds) {
		return <td key={`s${event.id}${row}`}>
			{row < rounds.length && <button className="scheduleButton" onClick={e => this.fire(this.Events.showSchedule, participantId, event)}>Välj starttid</button>}
		</td>;
	}

	roundButton(row, participantId, event, rounds) {
		let button = null;
		if (row === 0 && rounds.length < event.maxRegistrations) {
			button = <button className="button-add small" onClick={e => this.Registration.addParticipantRound(participantId, event.id)} />;
		}
		if (row < rounds.length && (row > 0 || rounds.length === event.maxRegistrations)) {
			button = <button className="button-close small deleteButton" onClick={e => this.Registration.deleteParticipantRound(participantId, event.id, row)} />;
		}
		return <td key={`r${event.id}${row}`}>{button}</td>;
	}

	EventControls = ({ row, numRows, participant, event }) => {
		const eventInfo = participant.event(event.id) || { event: event.id, rounds: [{}] };
		let controls = [];
		if (row === 0 && event.classes && this.Competition.classes(event.classes)) {
			controls.push(this.classDropdown(numRows, participant.id, event, eventInfo.class, this.Competition.classes(event.classes)));
		}
		if (event.divisions && this.Competition.divisions(event.divisions)) {
			controls.push(this.divisionDropdown(row, participant.id, event.id, eventInfo.rounds, this.Competition.divisions(event.divisions)));
		}
		if (event.schedule) {
			controls.push(this.scheduleButton(row, participant.id, event, eventInfo.rounds));
			if (event.maxRegistrations > 1) {
				controls.push(this.roundButton(row, participant.id, event, eventInfo.rounds));
			}
		}

		if (controls.length === 0 && row === 0) {
			controls.push(<td key="participate" className="center"><input type="checkbox" className="checkbox" onChange={c =>
				this.Registration.setParticipantEvent(participant.id, event.id, c.target.checked)
			} checked={participant.participate(event.id)} /></td>);
		}

		return controls;
	}

	RegistrationControls = ({ row, numRows, participant }) => {
		return this.Competition.eventList().map(e => <this.EventControls key={e.id} row={row} numRows={numRows} participant={participant} event={e} />);
	}

	RegistrationField = ({ numRows, participant, header }) => {
		return <td className="left" rowSpan={numRows}><input type="text" value={participant[header.field]}
			placeholder={header.placeholder || header.name} style={{ width: header.width }}
			onChange={e => this.Registration.setParticipantField(participant.id, header.field, e.target.value)}
			size={header.size} /></td>;
	}

	ParticipantFields = ({ numRows, participant }) => {
		return this.Competition.participantHeader().subFields.map(h => <this.RegistrationField key={h.field} numRows={numRows} participant={participant} header={h} />);
	}

	ParticipantRow = ({ row, numRows, participant }) => {
		let p = participant;
		return <tr className={p.errors.length > 0 ? "error registration" : "registration"}>
			{row === 0 && <this.ParticipantFields numRows={numRows} participant={p} />}
			<this.RegistrationControls row={row} numRows={numRows} participant={p} />
			{row === 0 && <td className="delete"><button className="button-close small red" onClick={e => this.Registration.deleteParticipant(p.id)} /></td>}
		</tr>;
	}

	numRounds(participant) {
		let maxRound = 1;
		participant.registrationInfo.forEach(e => {
			if (e.rounds.length > maxRound) {
				maxRound = e.rounds.length;
			}
		});
		return maxRound;
	}

	render() {
		let rows = [];
		let p = this.props.participant;
		let numRows = this.numRounds(p);
		for (let i = 0; i < numRows; i++) {
			rows.push(<this.ParticipantRow key={`${p.id}+${i}`} row={i} numRows={numRows} participant={p} />);
		}
		return rows;
	}
}