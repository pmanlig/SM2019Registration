import { Person, PersonDefinition } from './Person';
import { Discipline, DisciplineDefinition } from './Discipline';

export class Participant extends Person {
	static nextId = 0;
	id;
	registrationInfo;

	constructor(p) {
		super(p);
		this.id = Participant.nextId++;
		this.registrationInfo = DisciplineDefinition.getDiscipline(Discipline.milsnabb).concat(
			DisciplineDefinition.getDiscipline(Discipline.precision),
			DisciplineDefinition.getDiscipline(Discipline.field)).map((d) => { return false });
	}
}

export class ParticipantDefinition {
	static getHeaders() {
		return [
			PersonDefinition.getHeaders(),
			DisciplineDefinition.getHeaders(Discipline.milsnabb),
			DisciplineDefinition.getHeaders(Discipline.precision),
			DisciplineDefinition.getHeaders(Discipline.field),
		];
	}
}