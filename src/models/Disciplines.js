export class Disciplines {
	static target = 1;
	static field = 2;
	static PPC = 3;

	static list = [
		{ id: -1, description: "Ingen gren vald" },
		{ id: Disciplines.target, description: "Precision/Bana" },
		{ id: Disciplines.field, description: "Fält" },
		{ id: Disciplines.PPC, description: "PPC" }
	];
}