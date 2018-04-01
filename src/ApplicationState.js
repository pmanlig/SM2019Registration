import { Participant } from './Participant';
import { Person } from './Person';
import { setCookie, COOKIE_COMPETITORS } from './Cookies';

export class ApplicationState {
	static instance;

	updateState;
	addMessage;
	registry = [
	];
	registration = [];
	storeParticipants = "Nej";

	constructor(updateState, addMessage) {
		this.updateState = updateState;
		this.addMessage = addMessage;
	}

	addParticipant = p => {
		console.log("Adding new participant");
		this.registration.push(new Participant(p));
		this.updateState({});
	}

	deleteParticipant = (id) => {
		console.log("Deleting participant #" + id);
		this.registration = this.registration.filter((p) => { return p.id !== id; });
		this.updateState({});
	}

	setDivision = (participant, division, value) => {
		this.registration.forEach(p => { if (participant === p.id) p.registrationInfo[division] = value; });
		this.updateState({});
	}

	setParticipantName = (id, value) => {
		this.registration.forEach(p => { if (id === p.id) p.name = value; });
		this.updateState({});
	}

	setParticipantCompetitionId = (id, value) => {
		if (value.length < 6 && /^\d*$/.test(value)) {
			this.registration.forEach(p => { if (id === p.id) p.competitionId = value; });
			this.updateState({});
		}
	}

	setParticipantOrganization = (id, value) => {
		this.registration.forEach(p => { if (id === p.id) p.organization = value; });
		this.updateState({});
	}

	register = () => {
		let competitors = this.registration.map(p => new Person(p));
		this.registry.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.registry = competitors;
		setCookie(COOKIE_COMPETITORS, JSON.stringify(competitors));
		this.updateState({});
	}
}