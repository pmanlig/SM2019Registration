import { Person } from './Person';

export class Participant extends Person {
	static nextId = 0;
	errors = [];

	constructor(p, registrationInfo) {
		super(p);
		this.id = Participant.nextId++;
		this.registrationInfo = registrationInfo || [];
	}

	static fromServer({ participant, entries }) {
		return new Participant({
			name: participant.name,
			competitionId: participant.id,
			organization: participant.organization
		}, entries.map(e => {
			return {
				class: e.class,
				event: parseInt(e.event, 10),
				rounds: e.rounds === undefined ? undefined : e.rounds.map(r => {
					return {
						division: r.division,
						squad: r.squad === undefined ? undefined : parseInt(r.squad, 10),
						time: r.time
					}
				})
			}
		}));
	}

	toJson() {
		return {
			participant: {
				name: this.name,
				id: this.competitionId,
				organization: this.organization,
				support: this.registrationInfo.some(r => /VetÄ/.test(r.class)) ? 1 : 0
			},
			entries: this.registrationInfo.map(r => {
				return {
					class: r.class,
					event: r.event,
					rounds: r.rounds
				}
			})
		};
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

	addSquad(eventId, round, squad) {
		let info = this.addEvent(eventId);
		if (null === squad) {
			info.rounds[round].squad = undefined;
			info.rounds[round].time = undefined;
		} else {
			info.rounds[round].squad = squad.id;
			info.rounds[round].time = squad.startTime;
		}
	}

	getStartTime(eventId, round) {
		let info = this.event(eventId);
		return info === undefined ? undefined : (info.rounds[round] === undefined ? undefined : info.rounds[round].time);
	}

	getSquadsExcept(eventId, round) {
		let squads = [];
		this.registrationInfo.forEach(e => e.rounds.forEach((r, i) => {
			if (e.event !== eventId && round !== i && r.squad !== undefined) squads.push(r.squad);
		}));
		return squads;
	}

	getDivision(eventId, round) {
		let info = this.event(eventId);
		return info === undefined ? undefined : (info.rounds[round] === undefined ? undefined : info.rounds[round].division);
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