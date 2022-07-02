import { Validation, TeamValidation } from '../logic';
import { Person, Participant } from '.';
import { Team } from './Team';

export class Registration {
	static register = { name: "Registration", createInstance: true };
	static wire = ["subscribe", "fire", "Competition", "Storage", "Server", "EventBus", "Events", "Registry", "Footers", "Tokens"];

	token = undefined;
	contact = new Person();
	participants = [];
	teams = [];

	// ToDo: Rewrite to not use event handlers
	initialize() {
		this.subscribe(this.Events.setRegistrationInfo, this.setContactField.bind(this));
		this.subscribe(this.Events.selectSquad, this.selectSquad.bind(this));
		this.subscribe(this.Events.registerForCompetition, () => this.register());
		this.loadContact();
	}

	load(id, token) {
		if (token === undefined || token === null) {
			token = this.Tokens.getToken(id);
		}

		if (token !== undefined && token !== null) {
			this.Server.loadRegistration(id, token, json => {
				this.token = token;

				// Hack to compensate for server not storing organization
				// this.contact = Person.fromJson(json.contact);
				if (json.contact) {
					let nC = Person.fromJson(json.contact);
					nC.setDefaultOrganization(this.contact.organization);
					this.contact = nC;
				}

				// Loading participants from json
				if (json.registration) {
					this.participants = json.registration.map(p => Participant.fromServer(p));
					this.setParticipantDefaults();
				} else { this.participants = []; }

				if (json.teams) {
					this.teams = json.teams.map(t => Team.fromJson(t));
				} else { this.teams = []; }

				this.fire(this.Events.registrationUpdated, this);
			}, this.Footers.errorHandler("Kan inte hämta anmälan"));
		} else {
			this.token = undefined;
			this.loadContact();
			// ToDo: ???
			this.participants = [];
		}
	}

	loadContact() {
		let storedPerson = this.Storage.get(this.Storage.keys.registrationContact);
		this.contact = storedPerson ? Person.fromJson(storedPerson) : new Person();
		this.contact.account = this.contact.account || ""; // Patch to handle stored information without account
		this.fire(this.Events.registrationUpdated, this);
	}

	newRegistration = () => {
		this.token = undefined;
		this.participants = [];
		this.teams = [];
		this.loadContact();
		this.Tokens.setToken(this.Competition.id, undefined);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantDefaults() {
		this.participants.forEach(p => {
			p.registrationInfo = p.registrationInfo.filter(r => this.Competition.event(r.event) !== undefined);
			p.registrationInfo.forEach(r => {
				let event = this.Competition.event(r.event);
				if (event.classes) {
					let classes = this.Competition.classes(event.classes);
					if (!classes.includes(r.class)) {
						r.class = classes.find(c => c.startsWith("!")) || classes[0];
					}
				}
				if (event.divisions) {
					let divisions = this.Competition.divisions(event.divisions);
					r.rounds.forEach(rd => {
						if (!divisions.includes(rd.division)) {
							rd.division = divisions.find(d => d.startsWith("!")) || divisions[0];
						}
					});
				}
			});
		});
	}

	addMe() {
		if (this.participants.some(p => p.name === this.contact.name)) {
			this.fire(this.Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		let newParticipant = new Participant();
		newParticipant.name = this.contact.name;
		newParticipant.organization = this.contact.organization;
		let me = this.Registry.competitors.find(c => c.name === this.contact.name);
		if (me) { newParticipant.competitionId = me.competitionId; }
		this.Competition.events.forEach(e => newParticipant.addEvent(e.id));
		this.participants.push(newParticipant);
		this.setParticipantDefaults();
		this.fire(this.Events.registrationUpdated, this);
	}

	addParticipant(p) {
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(this.Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		let newParticipant = new Participant(p);
		if (p === undefined) {
			newParticipant.organization = this.contact.organization;
		}
		this.Competition.events.forEach(e => newParticipant.addEvent(e.id));
		this.participants.push(newParticipant);
		this.setParticipantDefaults();
		this.fire(this.Events.registrationUpdated, this);
	}

	getParticipant(pId) {
		return this.participants.find(p => pId === p.id);
	}

	deleteParticipant(id) {
		this.participants = this.participants.filter(p => {
			return p.id !== id;
		});
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantField(id, field, value) {
		if (field === "competitionId" && (value.length > 5 || !(/^\d*$/.test(value)))) {
			return;
		} // Add more validation rules later?
		this.participants.forEach(p => {
			if (p.id === id) { p[field] = value; }
		});
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantEvent(pId, eventId, value) {
		this.getParticipant(pId).setParticipate(eventId, value);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantClass(pId, event, value) {
		this.getParticipant(pId).addEvent(event.id).class = value.startsWith("!") ? undefined : value;
		this.fire(this.Events.registrationUpdated, this);
	}

	addParticipantRound(pId, id) {
		this.getParticipant(pId).addEvent(id).rounds.push({});
		this.setParticipantDefaults();
		this.fire(this.Events.registrationUpdated, this);
	}

	deleteParticipantRound(pId, eventId, round) {
		this.getParticipant(pId).event(eventId).rounds.splice(round, 1);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantDivision(pId, eventId, round, value) {
		this.getParticipant(pId).addEvent(eventId).rounds[round].division = (value.startsWith("!") ? undefined : value);
		this.getParticipant(pId).addSquad(eventId, round, {}); // Why do this?
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantSlot(pId, event, round, value) {
		this.getParticipant(pId).addEvent(event.id).rounds[round].slot = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	setContactField(field, value) {
		if (field === "account" && (value.length > 10 || !(/^\d*[-]?\d*$/.test(value)))) { return; } // Add more validation rules later?
		if (field === "email") { value = value.trim(); }
		this.contact[field] = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	selectSquad(pId, eventId, round, squad) {
		this.getParticipant(pId).addSquad(eventId, round, squad);
		this.fire(this.Events.registrationUpdated);
	}

	removeUnselected() {
		this.participants.forEach(p => {
			p.registrationInfo.forEach(e => {
				let divisions = this.Competition.event(e.event).divisions;
				let schedule = this.Competition.event(e.event).schedule;
				e.rounds = e.rounds
					.filter(r => r.division || !divisions || this.Competition.divisions(divisions).some(d => d.startsWith("!")))
					.filter(r => r.squad || !schedule);
			});
			p.registrationInfo = p.registrationInfo.filter(e => {
				let event = this.Competition.event(e.event);
				return (e.class || !event.classes || this.Competition.classes(event.classes).some(c => c.startsWith("!"))) &&
					(e.rounds.length > 0 || (!event.schedule && !event.divisions));
			});
		});
	}

	countEvents() {
		let events = 0;
		this.participants.forEach(p => { p.registrationInfo.forEach(r => { events += r.rounds.length; }) });
		return events;
	}

	toJson() {
		let registration = {
			competition: this.Competition.id,
			token: this.token,
			contact: this.contact.toJson(),
		};
		if (this.participants.length > 0) { registration.registration = this.participants.map(p => p.toJson()); }
		if (this.teams.length > 0) { registration.teams = this.teams.map(t => t.toJson()); }
		return registration;
	}

	register() {
		this.Storage.set(this.Storage.keys.registrationContact, this.contact);
		this.Registry.storeCompetitors(this.participants);
		this.removeUnselected();
		this.setParticipantDefaults();  // ToDo: missing values should result in errors instead?
		let errors = new Validation(this.Competition).validate(this.participants);
		if (errors.length === 0) {
			this.Server.sendRegistration(this.toJson(), res => {
				this.token = res.token;
				this.Tokens.setToken(this.Competition.id, res.token);
				this.Footers.addFooter(this.countEvents() + " starter registrerade", "info");
				this.fire(this.Events.registrationUpdated, this);
			}, error => {
				this.Footers.addFooter(`Registreringen misslyckades! (${error.message || error})`);
			});
		} else {
			this.Footers.addFooter(errors.length === 1 ? errors[0].error : errors.length + " fel hindrar registrering!");
			this.fire(this.Events.registrationUpdated, this);
		}
	}

	registerTeams() {
		this.Storage.set(this.Storage.keys.registrationContact, this.contact);
		let errors = new TeamValidation(this.Competition).validate(this.teams);
		if (errors.length === 0) {
			this.Server.updateRegistration(this.token, this.toJson(), res => {
				// this.token = res.token;
				// this.Tokens.setToken(this.Competition.id, res.token);
				this.Footers.addFooter(`${this.teams.length} lag registrerade`, "info")
				// this.fire(this.Events.registrationUpdated, this);
			}, error => {
				this.Footers.addFooter(`Registreringen misslyckades! (${error.message || error})`);
			});
		} else {
			this.Footers.addFooter(errors.length === 1 ? errors[0].error : errors.length + " fel hindrar registrering!");
			// this.fire(this.Events.registrationUpdated, this);
		}
	}

	deleteRegistration() {
		this.Server.deleteRegistration(this.Competition.id, this.token, () => {
			this.token = undefined;
			this.participants = [];
			this.Tokens.setToken(this.Competition.id, undefined);
			this.Footers.addFooter("Anmälan raderad", "info");
			this.fire(this.Events.registrationUpdated, this);
		}, this.Footers.errorHandler("Kan inte ta bort anmälan"));
	}
}