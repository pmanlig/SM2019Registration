export class Squad {
	members = [];

	constructor(startTime, slots, divisions, mixed, id) {
		this.startTime = startTime;
		this.slots = slots;
		this.divisions = divisions;
		this.mixed = mixed;
		this.id = id;
	}
}

export class Schedule {
	squadId = 1;
	squads = [];

	static fromJson(s) {
		let schedule = new Schedule();
		schedule.id = s.id;
		schedule.squadId = s.squadId;
		schedule.squads = s.squads;
		return schedule;
	}
	
	addSquad(startTime, slots, divisions, mixed) {
		this.squads.push(new Squad(startTime, slots, divisions, mixed, this.squadId++));
	}

	deleteSquad(squad) {
		this.squads = this.squads.filter(s => s.id !== squad.id);
	}
}