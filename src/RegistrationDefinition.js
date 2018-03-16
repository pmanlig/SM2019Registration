import { ParticipantDefinition } from './ParticipantDefinition';

export class RegistrationDefinition {
	static Disciplines = { milsnabb: 1, precision: 2, field: 3 };

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
			divChecks.push({ name: element, type: 'check' });
		});
		return divChecks;
	}

	static getRegistrationHeaders() {
		return [
			ParticipantDefinition.getParticipantHeaders(),
			{
				name: 'Militär Snabbmatch', subfields: this.getDivisionCheckboxes('milsnabb')
			},
			{
				name: 'Precision', subfields: this.getDivisionCheckboxes('prec')
			},
			{
				name: 'Fält', subfields: this.getDivisionCheckboxes('falt')
			},
		];
	}

	static getRegistration() {

	}
}