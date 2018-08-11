export class Event {
	id = 0;
	classes = undefined;
	divisions = undefined;
	schedule = undefined;
	maxRegistrations = 1;

	constructor(name, date) {
		this.name = name;
		this.date = date;
	}

	static fromJson(e) {
		let nE = new Event(e.name, new Date(e.date));
		nE.id = e.id;
		nE.classes = e.classes;
		nE.divisions = e.divisions;
		nE.schedule = e.schedule;
		nE.maxRegistrations = e.maxRegistrations;
		return nE;
	}
}