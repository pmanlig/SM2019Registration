export class RegistrationDefinition {
	static Disciplines = { milsnabb: 1, precision: 2, field: 3 };

	static ParticipantHeader = {
		name: 'Skytt', subfields: [
			{ name: 'Namn', width: 150, type: 'text' },
			{ name: 'Pistolskyttekort', type: 'number' },
			{ name: 'Förening', width: 150, type: 'text' },]
	};

	static getDivisions(discipline) {
		var divs = [
			'ÖpC',
			'JunC',
			'DamC',
			'VetYC',
			'VetÄC',
			'B',
			'A',
		];
		if (discipline !== this.Disciplines.precision)
			divs.push('R');
		return divs;
	}

	static getDivisionCheckboxes(discipline) {
		var divs = this.getDivisions(discipline);
		var divChecks = [];
		divs.forEach(element => {
			divChecks.push({name: element, type: 'check'});
		});
		return divChecks;
	}

	static getRegistrationHeaders() {
		return [this.ParticipantHeader,
		{
			name: 'Militär Snabbmatch', subfields: this.getDivisionCheckboxes('milsnabb')
		},
		{
			name: 'Precision', subfields: this.getDivisionCheckboxes('prec')
		},
		{
			name: 'Fält', subfields: this.getDivisionCheckboxes('falt')
		},
		]
	}
}