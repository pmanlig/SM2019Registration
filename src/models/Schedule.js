export class Squad {
	members = [];
	
	constructor(startTime, slots, divisions, mixed) {
		this.startTime = startTime;
		this.slots = slots;
		this.divisions = divisions;
		this.mixed = mixed;
	}
}

export class Schedule {
	squads = [];

	addSquad(squad) {
		this.squads.push(squad);
	}
}