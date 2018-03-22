import { PersonDefinition } from './Person';
import { Discipline, DisciplineDefinition } from './Discipline';

export const Prefixes = {
	name: "name",
	organization: "org",
	competitionId: "cid",
	division: "chk"
}

export function createTagId(prefix, id) {
	return prefix + id;
}

export function parseTagId(prefix, input) {
	return parseInt(input.split(prefix, 2)[1], 10);
}

export class Participant {
	static nextId = 0;
	id;
	name;
	competitionId;
	organization;
	registrationInfo;

	constructor() {
		this.id = Participant.nextId++;
		this.name = "";
		this.competitionId = "";
		this.organization = "";
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