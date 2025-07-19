export class Discipline {
	static none = -1;
	static target = 1;
	static fieldP = 2;
	static fieldK = 3;
	static scoredP = 4;
	static scoredK = 5;
	static PPC = 6;
	static sport5 = 7;
	static sport10 = 8;

	static list = [
		{ id: Discipline.none, description: "Ingen gren vald" },
		{ id: Discipline.target, description: "Precision/Bana" },
		{ id: Discipline.fieldP, description: "Fält (Pistol)" },
		{ id: Discipline.fieldK, description: "Fält (K-pist & Karbin)" },
		{ id: Discipline.scoredP, description: "Poängfält (Pistol)" },
		{ id: Discipline.scoredK, description: "Poängfält (K-pist & Karbin)" },
		{ id: Discipline.PPC, description: "PPC" },
		{ id: Discipline.sport5, description: "Sport 5-skott" },
		{ id: Discipline.sport10, description: "Sport 10-skott" }
	];

	static hasStages = [
		Discipline.fieldP,
		Discipline.fieldK,
		Discipline.scoredP,
		Discipline.scoredK
	];

	static fromJson(json) {
		json = parseInt(json, 10);
		return (isNaN(json) || json === 0) ? Discipline.none : json;
	}

	static toJson(d) {
		return d === Discipline.none ? 0 : d;
	}
}