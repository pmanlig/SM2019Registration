import { Participant } from './Participant';
import { Prefixes, parseTagId } from './Person';

export class Registration {
	participants;
	updateState;

	constructor(updateStateCallback) {
		this.participants = [];
		this.updateState = updateStateCallback;
		this.addParticipant = this.addParticipant.bind(this);
		this.deleteParticipant = this.deleteParticipant.bind(this);
		this.updateRegistration = this.updateRegistration.bind(this);
	}

	addParticipant() {
		console.log("Adding new participant");
		this.participants.push(new Participant());
		this.updateState();
	}

	deleteParticipant(id) {
		console.log("Deleting articipant #" + id);
		this.participants = this.participants.filter((p) => { return p.id !== id; });
		this.updateState();
	}

	updateRegistration(id, index, value) {
		this.participants.forEach((p) => { if (p.id === id) p.registrationInfo[index] = value; });
		this.updateState();
	}

	setParticipantName = (event) => {
		var id = parseTagId(Prefixes.name, event.target.id);
		this.participants.forEach(p => { if (id === p.id) p.name = event.target.value; });
		this.updateState();
	}

	setParticipantCompetitionId = (event) => {
		var id = parseTagId(Prefixes.competitionId, event.target.id);
		this.participants.forEach(p => { if (id === p.id) p.competitionId = event.target.value; });
		this.updateState();
	}

	setParticipantOrganization = (event) => {
		var id = parseTagId(Prefixes.organization, event.target.id);
		this.participants.forEach(p => { if (id === p.id) p.organization = event.target.value; });
		this.updateState();
	}
}