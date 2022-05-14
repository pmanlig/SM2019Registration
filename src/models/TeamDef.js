export class TeamDef {
	constructor(division, cls, members, alternates) {
		this.division = division;
		this.class = cls;
		this.members = members;
		this.alternates = alternates;
	}

	toJson() {
		let json = {
			members: this.members,
			alternates: this.alternates
		}
		if (this.division) { json.division = this.division; }
		if (this.class) { json.class = this.class; }
		return json;
	}

	static fromJson(json) {
		return new TeamDef(
			json.division !== "" ? json.division : undefined,
			json.class !== "" ? json.class : undefined,
			parseInt(json.members.toString(), 10),
			parseInt(json.alternates.toString(), 10));
	}
}