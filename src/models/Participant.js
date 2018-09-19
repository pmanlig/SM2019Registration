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
		let info = this.event(id);
		if (info !== undefined) { return info; }

		this.registrationInfo.push({ event: id, rounds: [{}] });
		return this.event(id);
	}

	addSquad(event, round, squad) {
		let info = this.addEvent(event);
		if (window._debug) {
			console.log(`Setting squad for ${event}, ${round}`);
			console.log(squad);
			console.log(info);
		}
		info.rounds[round].squad = squad.id;
		info.rounds[round].time = squad.startTime;
	}

	getStartTime(event, round) {
		let info = this.event(event);
		if (window._debug) {
			console.log(`Getting start time for ${event}, ${round}`);
			console.log(info);
		}
		return info === undefined ? undefined : (info.rounds[round] === undefined ? undefined : info.rounds[round].time);
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