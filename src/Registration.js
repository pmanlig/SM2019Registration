import { Participant } from './Participant';

export class Registration {
	participants;
	updateState;

	constructor(updateStateCallback, registerCallback) {
		this.participants = [];
		this.updateState = updateStateCallback;
		this.register = registerCallback;
	}

	addParticipant = p => {
		console.log("Adding new participant");
		this.participants.push(new Participant(p));
		this.updateState();
	}

	deleteParticipant = (id) => {
		console.log("Deleting articipant #" + id);
		this.participants = this.participants.filter((p) => { return p.id !== id; });
		this.updateState();
	}

	setDivision = (participant, division, value) => {
		this.participants.forEach(p => { if (participant === p.id) p.registrationInfo[division] = value; });
		this.updateState();
	}

	setParticipantName = (id, value) => {
		this.participants.forEach(p => { if (id === p.id) p.name = value; });
		this.updateState();
	}

	setParticipantCompetitionId = (id, value) => {
		this.participants.forEach(p => { if (id === p.id) p.competitionId = value; });
		this.updateState();
	}

	setParticipantOrganization = (id, value) => {
		this.participants.forEach(p => { if (id === p.id) p.organization = value; });
		this.updateState();
	}
}