import { InjectedClass } from '../logic';
import { Components, Events } from '.';

export class Permissions {
	static Any = 0;
	static Admin = 1;
	static Own = 2;
}

export class Status {
	static Hidden = 0;
	static Open = 1;
	static Closed = 2;
}

export const Operations = [
	{ name: "Anmälan", path: "register", permission: Permissions.Any, status: Status.Open },
	{ name: "Rapportera", path: "report", permission: Permissions.Admin },
	{ name: "Resultat", path: "results", permission: Permissions.Any, status: Status.Closed },
	{ name: "Administrera", path: "admin", permission: Permissions.Own }
];

export class Competition extends InjectedClass {
	id = 0;
	name = "";
	description = "";
	permissions = Permissions.Any;
	status = Status.Hidden;
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
					this.permissions = obj.permissions || Permissions.Any;
					this.status = /*obj.status ||*/ Status.Open;
					this.divisionGroups = obj.divisionGroups;
					this.classGroups = obj.classGroups;
					this.eventGroups = obj.eventGroups;
					this.events = obj.events;
					this.rules = obj.rules;
					this.fire(Events.competitionUpdated);
				}
			});
		} else {
			this.fire(Events.competitionUpdated);
		}
	}

	event(id) {
		let result = null;
		this.events.forEach(e => { if (e.id === id) result = e; });
		return result;
	}

	eventList(eventGroup) {
		let events = [];
		this.eventGroups.forEach(eg => (eventGroup === undefined || eg.id === eventGroup) && eg.events.forEach(e => events.push(this.event(e))));
		return events;
	}

	participantHeader() {
		return {
			name: 'Skytt', subFields: [
				{ name: 'Namn', field: 'name', width: 200, type: 'text' },
				{ name: 'Pistolskyttekort', field: 'competitionId', size: '5', placeholder: '00000', width: 40, type: 'number' },
				{ name: 'Förening', field: 'organization', width: 200, type: 'text' }]
		};
	}
}