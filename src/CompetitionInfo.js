export class CompetitionInfo {
	id;
	name;
	description;
	divisionGroups = [];
	classGroups = [];
	eventGroups = [];
	events = [];
	rules = [];

	constructor(id, name, description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
}