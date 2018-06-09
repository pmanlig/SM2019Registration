import { InjectedClass } from '../logic';
import { Components, Events } from '.';

export class Competition extends InjectedClass {
	id = 0;
	name = "";
	description = "";
	divisionGroups = [];
	classGroups = [];
	eventGroups = [];
	events = [];
	rules = [];

	load(id) {
		if (this.id !== id) {
			this.inject(Components.Server).loadCompetition(id, obj => {
				// Prevent multiple requests from screwing up the state
				if (obj.id !== this.id) {
					// ToDo: remove when service is fixed!
					this.id = obj.id || obj.competition_id;
					this.name = obj.name;
					this.description = obj.description;
					this.divisionGroups = obj.divisionGroups;
					this.classGroups = obj.classGroups;
					this.eventGroups = obj.eventGroups;
					this.events = obj.events;
					this.rules = obj.rules;
					this.fire(Events.competitionUpdated);
				}
			});
		}
	}

	event(id) {
		let result = null;
		this.events.forEach(e => { if (e.id === id) result = e; });
		return result;
	}
}