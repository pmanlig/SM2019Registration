export class Competition {
	id = 0;
	name = "";
	description = "";
	divisionGroups = [];
	classGroups = [];
	eventGroups = [];
	events = [];
	rules = [];

	static fromJson(obj) {
		let newObj = new Competition();
		// ToDo: remove when service is fixed!
		newObj.id = obj.id || obj.competition_id;
		newObj.name = obj.name;
		newObj.description = obj.description;
		newObj.divisionGroups = obj.divisionGroups;
		newObj.classGroups = obj.classGroups;
		newObj.eventGroups = obj.eventGroups;
		newObj.events = obj.events;
		newObj.rules = obj.rules;
		return newObj;
	}

	event(id) {
		let result = null;
		this.events.forEach(e => { if (e.id === id) result = e; });
		return result;
	}
}