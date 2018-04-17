export class CompetitionInfo {
	id;
	name;
	description;
	divisionGroups = [];
	classGroups = [];
	eventGroups = [];
	events = [];
	rules = [];

	static fromJson(obj) {
		let newObj = new CompetitionInfo(obj.id, obj.name, obj.description);
		newObj.divisionGroups = obj.divisionGroups;
		newObj.classGroups = obj.classGroups;
		newObj.eventGroups = obj.eventGroups;
		newObj.events = obj.events;
		newObj.rules = obj.rules;
		return newObj;
	}

	constructor(id, name, description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}

	event(id) {
		let result = null;
		this.events.forEach(e => { if (e.id === id) result = e; });
		return result;
	}
}