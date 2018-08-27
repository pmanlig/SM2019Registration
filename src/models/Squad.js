export class Squad {
	constructor(startTime, slots, divisions, mixed, id) {
		this.startTime = startTime;
		this.slots = slots;
		this.divisions = divisions;
		this.mixed = mixed;
		this.id = id;
		this.participants = [];
	}

	static fromJson(s) {
		let n = new Squad();
		if (s) {
			n.startTime = s.startTime;
			n.slots = s.slots;
			n.divisions = s.divisions;
			n.mixed = s.mixed;
			n.id = s.id;
			n.participants = s.participants || [];
		}
		return n;
	}
}