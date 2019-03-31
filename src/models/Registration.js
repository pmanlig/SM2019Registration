import { Validation } from '../logic';
import { Person, Participant } from '.';

export class Registration {
	static register = { name: "Registration", createInstance: true };
	static wire = ["subscribe", "fire", "Competition", "Storage", "Server", "EventBus", "Events", "Registry", "Footers", "Tokens"];

	token = undefined;
	contact = new Person();
	participants = [];

	// ToDo: Rewrite to not use event handlers
	initialize() {
		this.subscribe(this.Events.setRegistrationInfo, this.setContactField.bind(this));
		this.subscribe(this.Events.deleteParticipant, this.deleteParticipant.bind(this));
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
				// this.contact = new Person(json.contact);
				let nC = Person.fromJson(json.contact);
				if ((nC.name && nC.name !== "") ||
					(nC.competitionId && nC.competitionId !== "") ||
					(nC.organization && nC.organization !== "") ||
					(nC.email && nC.email !== "") ||
					(nC.account && nC.account !== "")) {
					if (!nC.organization) nC.organization = this.contact.organization;
					this.contact = nC;
				}

				// Loading participants from json
				this.participants = json.registration.map(p => Participant.fromJson(p));
				this.setParticipantDefaults();
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
		this.contact = this.Storage.get(this.Storage.keys.registrationContact) || new Person();
		this.contact.account = this.contact.account || ""; // Patch to handle stored information without account
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantDefaults() {
		this.participants.forEach(p => {
			p.registrationInfo.forEach(r => {
				let event = this.Competition.event(r.event);
				if (event.classes) {
					let classes = this.Competition.classes(event.classes);
					if (!classes.includes(r.class)) r.class = classes[0];
				}
				if (event.divisions) {
					let divisions = this.Competition.divisions(event.divisions);
					r.rounds.forEach(rd => {
						if (!divisions.includes(rd.division)) rd.division = divisions[0];
					});
				}
			});
		});
	}

	addParticipant(p) {
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(this.Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		this.participants.push(new Participant(p));
		this.setParticipantDefaults();
		this.fire(this.Events.registrationUpdated, this);
	}

	getParticipant(pId) {
		return this.participants.find(p => pId === p.id);
	}

	deleteParticipant(id) {
		this.participants = this.participants.filter(p => { return p.id !== id; });
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantField(id, field, value) {
		if (field === "competitionId" && (value.length > 5 || !(/^\d*$/.test(value)))) { return; } // Add more validation rules later?
		this.participants.forEach(p => { if (p.id === id) { p[field] = value; } });
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantEvent(pId, event, value) {
		this.getParticipant(pId).setParticipate(event.id, value);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantClass(pId, event, value) {
		this.getParticipant(pId).addEvent(event.id).class = value;
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
		this.getParticipant(pId).addEvent(eventId).rounds[round].division = value;
		this.getParticipant(pId).addSquad(eventId, round, {});
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantSlot(pId, event, round, value) {
		this.getParticipant(pId).addEvent(event.id).rounds[round].slot = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	setContactField(field, value) {
		if (field === "account" && (value.length > 8 || !(/^\d*[-]?\d*$/.test(value)))) { return; } // Add more validation rules later?
		this.contact[field] = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	selectSquad(pId, eventId, round, squad) {
		this.getParticipant(pId).addSquad(eventId, round, squad);
		this.fire(this.Events.registrationUpdated);
	}

	countEvents() {
		let events = 0;
		this.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	toJson() {
		return {
			competition: this.Competition.id,
			token: this.token,
			contact: { name: this.contact.name, email: this.contact.email, organization: this.contact.organization, account: this.contact.account },
			registration: this.participants.map(p => p.toJson())
		}
	}

	register() {
		this.Storage.set(this.Storage.keys.registrationContact, this.contact);
		this.Registry.storeCompetitors(this.participants);
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
}