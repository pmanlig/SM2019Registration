import { Person } from './Person';

export class Participant extends Person {
	static nextId = 0;
	id;
	registrationInfo = [];
	errors = [];

	constructor(p, registrationInfo) {
		super(p);
		this.id = Participant.nextId++;
		this.registrationInfo = registrationInfo || [];
	}

	event(id) {
		return this.registrationInfo.find(e => e.event === id);
	}

	addEvent(id) {
		if (this.event(id) === undefined) {
			this.registrationInfo.push({ event: id, rounds: [{}] });
		}
		return this.event(id);
	}

	removeEvent(id) {
		this.registrationInfo = this.registrationInfo.filter(e => e.event !== id);
	}

	participate(id) {
		return this.event(id) !== undefined;
	}

	setParticipate(id, value) {
		if (value) {
			this.addEvent(id);
		} else {
			this.removeEvent(id);
		}
	}
}