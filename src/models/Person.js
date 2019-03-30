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

	static fromJson(json) {
		return new Person(
			json.name || "",
			json.competitionId || "",
			json.organization || "",
			json.email || "",
			json.account || "");
	}
}