import { Discipline, StageDef } from '.';

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

	adjustStages() {
		if (Discipline.hasStages.includes(this.discipline)) {
			while (this.stages.length < this.scores) { this.stages.push(new StageDef(this.stages.length + 1)) }
			while (this.stages.length > this.scores) { this.stages.pop(); }
		}
	}

	getStage(num) {
		return this.stages.find(s => s.num === num);
	}

	static fromJson(e) {
		function toNumber(x) {
			if (x === undefined) { return undefined; }
			x = parseInt(x.toString(), 10);
			return isNaN(x) ? undefined : x;
		}

		let nE = new Event(toNumber(e.id), e.name, new Date(e.date || Date.now()));
		nE.classes = toNumber(e.classes);
		nE.divisions = toNumber(e.divisions);
		nE.schedule = ((typeof e.schedule === "object") ? e.schedule.id : toNumber(e.schedule));
		nE.schedule = nE.schedule === 0 ? undefined : nE.schedule;
		nE.maxRegistrations = parseInt(e.maxRegistrations.toString(), 10);
		nE.scores = e.scores !== undefined ? parseInt(e.scores.toString(), 10) : 8;
		nE.cost = e.cost !== undefined ? parseInt(e.cost.toString(), 10) : 100;
		nE.discipline = Discipline.fromJson(e.discipline);
		nE.stages = e.stages !== undefined ? e.stages.map(s => StageDef.fromJson(s)) : [];
		return nE;
	}

	// Necessary to avoid storing objects
	toJson() {
		function pad(num) {
			let s = num.toString();
			while (s.length < 2) s = "0" + s;
			return s;
		}

		return {
			name: this.name,
			// date: this.date,
			date: `${this.date.getFullYear()}-${pad(this.date.getMonth() + 1)}-${pad(this.date.getDate())}`,
			id: this.id,
			classes: this.classes,
			divisions: this.divisions,
			schedule: this.schedule && this.schedule.id ? this.schedule.id : this.schedule,
			maxRegistrations: this.maxRegistrations,
			scores: this.scores,
			cost: this.cost,
			discipline: Discipline.toJson(this.discipline),
			stages: Discipline.hasStages.includes(this.discipline) ? this.stages.map(s => s.toJson()) : []
		};
	}
}