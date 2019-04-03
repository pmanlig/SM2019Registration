export class Squad {
	constructor(startTime, slots, divisions, mixed, id) {
		this.id = id;
		this.startTime = startTime;
		this.slots = slots;
		this.divisions = divisions;
		this.mixed = mixed;
		this.participants = [];
	}

	static fromJson(s) {
		let n = new Squad();
		n.stored = true;
		if (s) {
			n.startTime = s.startTime.split(":").slice(0, 2).join(":");
			while (n.startTime[0] === '0') { n.startTime = n.startTime.slice(1); }
			n.slots = parseInt(s.slots.toString(), 10);
			n.divisions = [...new Set(s.divisions)]; // Fix to mitigate server bug
			n.mixed = s.mixed === "true";
			n.id = parseInt(s.id.toString(), 10);
			n.participants = s.participants || [];
		}
		return n;
	}

	toJson() {
		// eslint-disable-next-line
		let { id, stored, ...data } = this;
		if (this.stored) data.id = id;
		return data;
	}
}