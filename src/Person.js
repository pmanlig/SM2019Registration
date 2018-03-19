export class Person {
	name;
	id;
	organization;

	constructor(n, i, o) {
		this.name = n;
		this.id = i;
		this.organization = o;
	}
}

export class PersonDefinition {
	static ParticipantHeader = {
		name: 'Skytt', subfields: [
			{ name: 'Namn', width: 150, type: 'text' },
			{ name: 'Pistolskyttekort', type: 'number' },
			{ name: 'Förening', width: 150, type: 'text' },]
	};

	static getHeaders() {
		return PersonDefinition.ParticipantHeader;
	}

	static getParticipant() {
		return new Person('', '', '');
	}
}