import { Discipline } from '.';

export class Event {
	constructor(id, name, date) {
		this.id = id;
		this.name = name;
		this.date = date;
		this.discipline = Discipline.none;
		this.maxRegistrations = 1;
		this.scores = 8;
		this.stages = [];
		this.cost = 100;
	}

	static toNumber(x) {
		if (x === undefined) { return undefined; }
		x = parseInt(x.toString(), 10);
		return isNaN(x) ? undefined : x;
	}

	pad(num) {
		let s = num.toString();
		while (s.length < 2) s = "0" + s;
		return s;
	}

	static fromJson(e) {
		let nE = new Event(Event.toNumber(e.id), e.name, new Date(e.date || Date.now()));
		nE.classes = Event.toNumber(e.classes);
		nE.divisions = Event.toNumber(e.divisions);
		nE.schedule = ((typeof e.schedule === "object") ? e.schedule.id : Event.toNumber(e.schedule));
		nE.schedule = nE.schedule === 0 ? undefined : nE.schedule;
		nE.maxRegistrations = parseInt(e.maxRegistrations.toString(), 10);
		nE.scores = e.scores !== undefined ? parseInt(e.scores.toString(), 10) : 8;
		nE.cost = e.cost !== undefined ? parseInt(e.cost.toString(), 10) : 100;
		nE.discipline = e.discipline !== undefined ? parseInt(e.discipline, 10) : Discipline.none;
		nE.stages = e.stages || [];
		return nE;
	}

	// Necessary to avoid storing objects
	toJson() {
		return {
			name: this.name,
			// date: this.date,
			date: `${this.date.getFullYear()}-${this.pad(this.date.getMonth() + 1)}-${this.pad(this.date.getDate())}`,
			id: this.id,
			classes: this.classes,
			divisions: this.divisions,
			schedule: this.schedule && this.schedule.id ? this.schedule.id : this.schedule,
			maxRegistrations: this.maxRegistrations,
			scores: this.scores,
			cost: this.cost,
			discipline: this.discipline,
			// stages: this.stages
		};
	}
}