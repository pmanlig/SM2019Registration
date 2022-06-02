export class Team {
	constructor(name, event, index) {
		this.name = name;
		this.event = event;
		this.index = index;
		this.members = [];
		this.alternates = [];
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
			members: this.members,
			alternates: this.alternates
		};
	}

	static fromJson(json) {
		let nt = new Team(json.name, parseInt(json.event, 10), parseInt(json.index, 10));
		nt.members = json.members.map(m => parseInt(m, 10));
		nt.alternates = json.alternates.map(a => parseInt(a, 10));
		return nt;
	}
}