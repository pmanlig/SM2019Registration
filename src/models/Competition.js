import { Event } from '.';
import { EventGroup } from './EventGroup';

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
	{ name: "Startlista", path: "roster", permission: Permissions.Any },
	{ name: "Administrera anmälningar", path: "registrations", permission: Permissions.Admin, status: Status.Open },
	// { name: "Rapportera", path: "report", permission: Permissions.Admin },
	// { name: "Resultat", path: "results", permission: Permissions.Any, status: Status.Closed },
	{ name: "Inställningar", path: "admin", permission: Permissions.Own }
];

export class Competition {
	static register = { name: "Competition", createInstance: true };
	static wire = ["fire", "subscribe", "Events", "Server", "ClassGroups", "DivisionGroups", "Session", "Footers"];

	initialize = () => {
		this.id = 0;
		this.name = "";
		this.shortDesc = "";
		this.description = "";
		this.group = "";
		this.permissions = Permissions.Own;
		this.status = Status.Hidden;
		this.eventGroups = [];
		this.events = [new Event(1, "", new Date())];
		this.rules = [];
		this.nextNewEvent = 2;
		this.dirty = false;
		if (!this.subscription) {
			this.subscription = this.subscribe(this.Events.serverChanged, () => this.changeServer());
		}
		if (!this.userSub) {
			this.userSub = this.subscribe(this.Events.userChanged, () => this.refresh());
		}
	}

	changeServer() {
		let id = this.id;
		this.id = 0;
		this.load(id);
	}

	load = (id) => {
		if (id === 0) return;
		if (this.id !== id) {
			if (this.ClassGroups.classGroups.length === 0)
				this.ClassGroups.load(() => this.fire(this.Events.competitionUpdated));
			if (this.DivisionGroups.divisionGroups.length === 0)
				this.DivisionGroups.load(() => this.fire(this.Events.competitionUpdated));
			this.Server.loadCompetition(id, obj => {
				// Prevent multiple requests from screwing up the state
				if (obj !== undefined && obj.id !== this.id) {
					this.initialize();
					this.fromJson(obj);
					this.fire(this.Events.competitionUpdated);
				}
			}, this.Footers.errorHandler("Kan inte hämta tävling"));
		} else {
			this.fire(this.Events.competitionUpdated);
		}
	}

	saveCompetition() {
		this.Server.updateCompetition(this.toJson(), s => {
			this.refresh();
			this.fire(this.Events.competitionUpdated);
			this.Footers.addFooter("Ändringarna har sparats", "info");
		}, this.Footers.errorHandler("Kan inte spara tävling"));
	}

	refresh() {
		if (this.id === 0) return;
		this.Server.loadCompetition(this.id,
			obj => {
				if (obj !== undefined) {
					this.initialize();
					this.fromJson(obj);
					this.fire(this.Events.competitionUpdated);
				}
			},
			this.Footers.errorHandler("Kan inte hämta tävling"));
	}

	fromJson(obj) {
		if (obj) {
			this.id = obj.id || obj.competition_id || this.id;
			this.name = obj.name || this.name;
			this.shortDesc = obj.subtitle || this.shortDesc;
			this.group = obj.group || this.group;
			if (obj.name.includes("$")) {
				// Compatibility
				let parts = obj.name.split("$");
				if (parts.length > 2) {
					this.group = parts[0];
					this.name = parts[1];
					this.shortDesc = parts[2];
				} else {
					this.name = parts[0];
					this.shortDesc = parts[1];
				}
			}
			if (obj.description.includes("<desc>")) {
				this.description = obj.description.match(/<desc>(.*)<\/desc>/)[1];
				this.group = obj.description.match(/<group>(.*)<\/group>/)[1];
				this.shortDesc = obj.description.match(/<sub>(.*)<\/sub>/)[1];
			} else {
				this.description = obj.description || this.description;
			}
			this.eventGroups = obj.eventGroups ? obj.eventGroups.map(eg => EventGroup.fromJson(eg)) : this.eventGroups;
			this.events = obj.events ? obj.events.map(e => Event.fromJson(e)) : this.events;
			this.nextNewEvent = Math.max(...this.events.filter(e => e.id < 1000).map(e => e.id), 0) + 1;
			this.rules = obj.rules || this.rules;
			this.permissions = obj.permissions ? parseInt(obj.permissions.toString(), 10) :
				(this.Session.user === "" || this.Session.user === undefined ? Permissions.Any : Permissions.Own);
			this.status = (obj.status !== undefined) ? parseInt(obj.status.toString(), 10) : Status.Open;
			this.dirty = false;
			this.fire(this.Events.competitionUpdated);
		}
	}

	// Necessary to avoid trying to serialize methods & more
	toJson() {
		return {
			id: this.id,
			name: `${this.name}`,
			subtitle: `${this.shortDesc}`,
			group: `${this.group}`,
			description: `<desc>${this.description}</desc><group>${this.group}</group><sub>${this.shortDesc}</sub>`,
			status: this.status,
			mailTemplate: 1, // TODO: Implement!
			events: this.events.map(e => e.toJson()),
			eventGroups: this.eventGroups,
			rules: this.rules
		};
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
		if (this.eventGroups.length === 0) return this.events;
		let events = [];
		this.eventGroups.forEach(eg => {
			if (eventGroup === undefined || eg.id === eventGroup) {
				eg.events.forEach(e => events.push(this.event(e)))
			}
		});
		return events;
	}

	participantHeaders() {
		return [
			{ name: 'Namn*', field: 'name', placeholder: 'Namn', width: 200, type: 'text' },
			{ name: 'Pistolskyttekort*', field: 'competitionId', size: '5', placeholder: '00000', width: 40, type: 'number' },
			{ name: 'Förening', field: 'organization', width: 200, type: 'text' }];
	}

	classes(classGroupId) {
		// Hack to handle nonexisting classGroup
		let classGroup = this.ClassGroups.find(c => c.id === classGroupId);
		return classGroup && classGroup.classes;
	}

	divisions(divisionGroupId) {
		// Hack to handle nonexisting divisionGroup
		let divisionGroup = this.DivisionGroups.find(d => d.id === divisionGroupId);
		return divisionGroup && divisionGroup.divisions;
	}

	/*** Properties *****************************************************************************************************/

	addEvent() {
		if (this.events.length === 1) {
			this.events[0].name = "Deltävling 1";
		}
		this.events.push(new Event(this.nextNewEvent++, "Deltävling " + (this.events.length + 1), new Date()));
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}

	removeEvent(event) {
		this.events = this.events.filter(e => e.id !== event.id);
		if (this.events.length === 1) {
			this.events[0].name = "";
		}
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}

	updateEvent(event, prop, value) {
		this.events.forEach(e => {
			if (e.id === event.id) {
				if (prop) {
					e[prop] = value;
				} else {
					Object.keys(e).forEach((k, i) => e[k] = event[k]);
				}
			}
		});
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}

	setProperty(prop, value) {
		this[prop] = value;
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}

	addRule(rule) {
		this.rules.push(rule);
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}

	removeRule(rule) {
		this.rules = this.rules.filter(r => r !== rule);
		this.dirty = true;
		this.fire(this.Events.competitionUpdated);
	}
}