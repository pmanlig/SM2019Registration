export class Person {
	name;
	competitionId;
	organization;
	email;

	constructor(nameOrPerson, id, organization, email) {
		this.name = nameOrPerson || "";
		this.competitionId = id || "";
		this.organization = organization || "";
		this.email = email || "";
		if (typeof nameOrPerson === "object") {
			this.name = nameOrPerson.name;
			this.competitionId = nameOrPerson.competitionId || "";
			this.organization = nameOrPerson.organization || "";
			this.email = nameOrPerson.email;
		}
	}
}