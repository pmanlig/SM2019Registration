import { Divisions } from './Divisions';

export class Registration {
	name = '';
	cardno = '';
	club = '';
	events = [];

	eventStatus(discipline) {
		events = [];
		Divisions.getDivisions(discipline).forEach(division => {
			events.push({ discipline: discipline, division: division, enter: false });
		});
	}

	constructor() {
		this.events.concat(this.eventStatus('milSnabb'));
		this.events.concat(this.eventStatus('prec'));
		this.events.concat(this.eventStatus('falt'));
	}
}