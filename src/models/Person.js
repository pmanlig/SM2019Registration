export class Person {
	name;
	competitionId;
	organization;

	constructor(nameOrPerson, id, organization) {
		this.name = nameOrPerson ? nameOrPerson : "";
		this.competitionId = id ? id : "";
		this.organization = organization ? organization : "";
		if (typeof nameOrPerson === "object") {
			this.name = nameOrPerson.name;
			this.competitionId = nameOrPerson.competitionId;
			this.organization = nameOrPerson.organization;
		}
	}
}