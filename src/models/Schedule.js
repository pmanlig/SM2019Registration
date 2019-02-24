import { Squad } from '.';

export class Schedule {
	nextSquadId = 1;
	squads = [];

	static fromJson(s) {
		let schedule = new Schedule();
		schedule.id = s.id;
		schedule.nextSquadId = s.squadId;
		// ToDo: why is null present?
		schedule.squads = s.squads.filter(x => x !== null).map(s => Squad.fromJson(s));
		return schedule;
	}

	toJson() {
		return {
			id: this.id,
			squads: this.squads
		};
	}

	addSquad(startTime, slots, divisions, mixed) {
		this.squads.push(new Squad(startTime, slots, divisions, mixed, this.nextSquadId++));
	}

	deleteSquad(squad) {
		this.squads = this.squads.filter(s => s.id !== squad.id);
	}

	updateSquadProperty(squadId, property, value) {
		this.squads.forEach(s => { if (s.id === squadId) { s[property] = value; } });
	}
}