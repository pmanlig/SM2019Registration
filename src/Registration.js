import { Participant, Prefixes, parseTagId } from './Participant';

export class Registration {
	participants;
	updateState;

	constructor(updateStateCallback) {
		this.participants = [];
		this.updateState = updateStateCallback;
	}

	addParticipant = () => {
		console.log("Adding new participant");
		this.participants.push(new Participant());
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

	setParticipantOrganization = (event) => {
		var id = parseTagId(Prefixes.organization, event.target.id);
		this.participants.forEach(p => { if (id === p.id) p.organization = event.target.value; });
		this.updateState();
	}
}