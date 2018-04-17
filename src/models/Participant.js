import { Person } from './Person';

export class Participant extends Person {
	static nextId = 0;
	id;
	registrationInfo;

	constructor(p, registrationInfo) {
		super(p);
		this.id = Participant.nextId++;
		this.registrationInfo = registrationInfo;
	}
}