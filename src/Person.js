export class Person {
	name;
	id;
	organization;

	constructor(name, id, organization) {
		this.name = name;
		this.id = id;
		this.organization = organization;
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