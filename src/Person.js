export class Person {
	name;
	competitionId;
	organization;

	constructor(nameOrPerson, id, organization) {
		this.name = nameOrPerson;
		this.competitionId = id;
		this.organization = organization;
		if (typeof nameOrPerson === "object") {
			this.name = nameOrPerson.name;
			this.competitionId = nameOrPerson.competitionId;
			this.organization = nameOrPerson.organization;
		}
	}
}

export class PersonDefinition {
	static ParticipantHeader = {
		name: 'Skytt', subfields: [
			{ name: 'Namn', width: 200, type: 'text' },
			{ name: 'Pistolskyttekort', type: 'number' },
			{ name: 'Förening', width: 200, type: 'text' },]
	};

	static getHeaders() {
		return PersonDefinition.ParticipantHeader;
	}

	static getParticipant() {
		return new Person('', '', '');
	}
}