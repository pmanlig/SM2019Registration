export class Event {
	classes = undefined;
	divisions = undefined;
	schedule = undefined;
	maxRegistrations = 1;

	constructor(id, name, date) {
		this.id = id;
		this.name = name;
		this.date = date;
	}

	static toNumber(x) {
		if (x === undefined) { return undefined; }
		x = parseInt(x.toString(), 10);
		return isNaN(x) ? undefined : x;
	}

	static fromJson(e) {
		let nE = new Event(Event.toNumber(e.id), e.name, new Date(e.date || Date.now()));
		nE.classes = Event.toNumber(e.classes);
		nE.divisions = Event.toNumber(e.divisions);
		nE.schedule = ((typeof e.schedule === "object") ? e.schedule.id : Event.toNumber(e.schedule));
		nE.schedule = nE.schedule === 0 ? undefined : nE.schedule;
		nE.maxRegistrations = parseInt(e.maxRegistrations.toString(), 10);
		return nE;
	}

	// Necessary to avoid storing objects
	toJson() {
		return {
			name: this.name,
			date: this.date,
			id: this.id,
			classes: this.classes,
			divisions: this.divisions,
			schedule: this.schedule && this.schedule.id ? this.schedule.id : this.schedule,
			maxRegistrations: this.maxRegistrations
		};
	}
}