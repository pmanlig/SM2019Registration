export class TeamDef {
	constructor(division, cls, members, alternates, cost) {
		this.division = division;
		this.class = cls;
		this.members = members || 2;
		this.alternates = alternates || 1;
		this.cost = cost || 0;
	}

	toJson() {
		let json = {
			members: this.members,
			alternates: this.alternates
		}
		if (this.division) { json.division = this.division; }
		if (this.class) { json.class = this.class; }
		json.cost = this.cost;
		return json;
	}

	static fromJson(json) {
		return new TeamDef(
			json.division !== "" ? json.division : undefined,
			json.class !== "" ? json.class : undefined,
			parseInt(json.members.toString(), 10),
			parseInt(json.alternates.toString(), 10),
			parseInt(json.cost, 10));
	}
}