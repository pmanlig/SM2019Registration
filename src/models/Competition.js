import { Events, Event } from '.';

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

export class Competition {
	static register = { name: "Competition", createInstance: true };
	static wire = ["fire", "Server"];

	initialize = () => {
		this.id = 0;
		this.name = "";
		this.description = "";
		this.permissions = Permissions.Own;
		this.status = Status.Hidden;
		this.divisionGroups = [];
		this.classGroups = [];
		this.eventGroups = [];
		this.events = [new Event("", new Date())];
		this.rules = [];
	}

	load(id) {
		if (this.id !== id) {
			this.Server.loadCompetition(id, obj => {
				// Prevent multiple requests from screwing up the state
				if (obj.id !== this.id) {
					this.initialize();
					this.loadFrom(obj);
				}
			});
		} else {
			this.fire(Events.competitionUpdated);
		}
	}

	loadFrom(obj) {
		if (obj) {
			// ToDo: remove when service is fixed!
			this.id = obj.id || obj.competition_id || this.id;
			this.name = obj.name || this.name;
			this.description = obj.description || this.description;
			this.eventGroups = obj.eventGroups || this.eventGroups;
			this.events = obj.events ? obj.events.map(e => Event.fromJson(e)) : this.events;
			this.divisionGroups = obj.divisionGroups || this.divisionGroups;
			this.classGroups = obj.classGroups || this.classGroups;
			this.rules = obj.rules || this.rules;
			this.permissions = obj.permissions || Permissions.Any;
			this.status = /*obj.status ||*/ Status.Open;
			this.fire(Events.competitionUpdated);
		}
	}

	// Necessary to avoid trying to serialize methods & more
	toJson() {
		return JSON.stringify({
			name: this.name,
			description: this.description,
			events: this.events.map(e => e.toJson()),
		});
	}

	/*** Properties *****************************************************************************************************/

	setProperty(prop, value) {
		this[prop] = value;
		this.fire(Events.competitionUpdated);
	}

	setEventIds() {
		let id = 1;
		this.events.forEach(e => e.id = id++);
		this.fire(Events.competitionUpdated);
	}

	addEvent() {
		if (this.events.length === 1) {
			this.events[0].name = "Deltävling 1";
		}
		this.events.push(new Event("Deltävling " + (this.events.length + 1), new Date()));
		this.setEventIds();
	}

	removeEvent(event) {
		this.events = this.events.filter(e => e.id !== event.id);
		if (this.events.length === 1) {
			this.events[0].name = "";
		}
		this.setEventIds();
	}

	updateEvent(event, prop, value) {
		this.events.forEach(e => {
			if (e.id === event.id) {
				e[prop] = value;
			}
		});
		this.fire(Events.competitionUpdated);
	}

	/*** Methods*********************************************************************************************************/

	/**
	 * Gets the event with the given ID
	 * @param id - Event ID
	 * @return {object} The event object or undefined if no event with the given ID exists
	 */
	event(id) {
		return this.events.find(e => e.id === id);
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

	classes(classGroupId) {
		// Hack to handle nonexisting classGroup
		let classGroup = this.classGroups.find(c => c.id === classGroupId);
		return classGroup && classGroup.classes;
	}

	divisions(divisionGroupId) {
		// Hack to handle nonexisting divisionGroup
		let divisionGroup = this.divisionGroups.find(d => d.id === divisionGroupId);
		return divisionGroup && divisionGroup.divisions;
	}
}