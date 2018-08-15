import { Squad } from '.';

export class Schedule {
	squadId = 1;
	squads = [];

	static fromJson(s) {
		let schedule = new Schedule();
		schedule.id = s.id;
		schedule.squadId = s.squadId;
		schedule.squads = s.squads.map(s => Squad.fromJson(s));
		return schedule;
	}

	addSquad(startTime, slots, divisions, mixed) {
		this.squads.push(new Squad(startTime, slots, divisions, mixed, this.squadId++));
	}

	deleteSquad(squad) {
		this.squads = this.squads.filter(s => s.id !== squad.id);
	}

	updateSquadProperty(squadId, property, value) {
		this.squads.forEach(s => { if (s.id === squadId) { s[property] = value; } });
	}
}