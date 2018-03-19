export var Discipline = { milsnabb: 0, precision: 1, field: 2 };
var DisciplineName = ["Militär Snabbmatch", "Precision", "Fält"];

export class DisciplineDefinition {
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
		if (discipline !== Discipline.precision)
			divs.push('R');
		return divs;
	}

	static getHeaders(discipline) {
		return { name: DisciplineName[discipline], subfields: this.getDivisions(discipline).map((elem) => { return { name: elem, type: 'check' } }) };
	}

	static getDiscipline(discipline) {
		return this.getDivisions(discipline).map((elem)=>{return false});
	}
}