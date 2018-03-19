import { Participant } from './Participant';

export class Registration {
	participants;
	updateState;

	constructor(updateStateCallback) {
		this.participants = [];
		this.updateState = updateStateCallback;
		this.addParticipant = this.addParticipant.bind(this);
		this.deleteParticipant = this.deleteParticipant.bind(this);
	}

	addParticipant() {
		console.log("Adding new participant");
		this.participants.push(new Participant());
		this.updateState();
	}

	deleteParticipant(id) {
		console.log("Deleting articipant #"+id);
		this.participants = this.participants.filter((p) => { return p.id !== id; });
		this.updateState();
	}
}