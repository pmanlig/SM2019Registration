export class Person {
	name;
	competitionId;
	organization;
	email;

	constructor(nameOrPerson, id, organization, email, account) {
		this.name = nameOrPerson || "";
		this.competitionId = id || "";
		this.organization = organization || "";
		this.email = email || "";
		this.account = account || "";
		if (typeof nameOrPerson === "object") {
			this.name = nameOrPerson.name;
			this.competitionId = nameOrPerson.competitionId || "";
			this.organization = nameOrPerson.organization || "";
			this.email = nameOrPerson.email || "";
			this.account = nameOrPerson.account || "";
		}
	}

	static fronJson(json) {
		this.name = json.name || "";
		this.competitionId = json.competitionId || "";
		this.organization = json.organization || "";
		this.email = json.email || "";
		this.account = json.account || "";
	}
}