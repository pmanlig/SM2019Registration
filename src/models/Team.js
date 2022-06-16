export class Team {
	constructor(name, event, index, teamDefID) {
		this.name = name;
		this.event = event;
		this.index = index;
		this.members = [];
		this.alternates = [];
		this.team_definition_id = teamDefID;
		this.checkInitialized("name", "event", "index");
	}

	checkInitialized(...props) {
		props.forEach(prop => {
			if (this[prop] === undefined) { throw new Error(`Property ${prop} is undefined`); }
		});
	}

	toJson() {
		return {
			name: this.name,
			event: this.event,
			index: this.index,
			members: this.members.filter(x => x !== undefined),
			alternates: this.alternates.filter(x => x !== undefined),
			team_definition_id: this.team_definition_id
		};
	}

	static fromJson(json) {
		let nt = new Team(json.name, parseInt(json.event, 10), parseInt(json.index, 10));
		nt.members = json.members.map(m => parseInt(m, 10));
		nt.alternates = json.alternates.map(a => parseInt(a, 10));
		if (json.team_definition_id) nt.id = parseInt(json.team_definition_id, 10);
		return nt;
	}
}