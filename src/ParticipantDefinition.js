export class ParticipantDefinition {
	static ParticipantHeader = {
		name: 'Skytt', subfields: [
			{ name: 'Namn', width: 150, type: 'text' },
			{ name: 'Pistolskyttekort', type: 'number' },
			{ name: 'Förening', width: 150, type: 'text' },]
	};

	static getParticipantHeaders() {
		return this.ParticipantHeader;
	}

	static getParticipant() {
		return { name: '', id: '', organization: '' };
	}
}