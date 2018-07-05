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

	participate(id) {
		return this.registrationInfo.some(e => e.event === id);
	}

	setParticipate(id, value) {
		if (value) {
			if (!this.participate(id)) {
				this.registrationInfo.push({ event: id });
			}
		} else {
			this.registrationInfo = this.registrationInfo.filter(e => e.event !== id);
		}
	}

	competitionClass(id) {
		let eventInfo = this.registrationInfo.find(e => e.event === id);
		return eventInfo && eventInfo.competitionClass;
	}

	setCompetitionClass(id, competitionClass) {
		let eventInfo = this.registrationInfo.find(e => e.event === id);
		if (eventInfo) {
			eventInfo.competitionClass = competitionClass;
		} else {
			this.registrationInfo.push({ event: id, competitionClass: competitionClass });
		}
	}

	division(id) {
		let eventInfo = this.registrationInfo.find(e => e.event === id);
		return eventInfo && eventInfo.division;
	}

	setDivision(id, division) {
		let eventInfo = this.registrationInfo.find(e => e.event === id);
		if (eventInfo) {
			eventInfo.division = division;
		} else {
			this.registrationInfo.push({ event: id, division: division });
		}
	}
}