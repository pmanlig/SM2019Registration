import { Validation, StorageKeys } from '../logic';
import { Person, Participant } from '.';

export class Registration {
	static register = { name: "Registration", createInstance: true };
	static wire = ["subscribe", "fire", "Competition", "Storage", "Server", "EventBus", "Events", "Registry", "Footers"];
	// static wire = ["subscribe"];

	token = undefined;
	contact = new Person();
	participants = [];

	// ToDo: Rewrite to not use event handlers
	initialize() {
		this.subscribe(this.Events.setRegistrationInfo, this.setContactField.bind(this));
		this.subscribe(this.Events.deleteParticipant, this.deleteParticipant.bind(this));
		this.subscribe(this.Events.registerForCompetition, () => this.register());
		this.contact = this.Storage.get("Contact") || new Person();
		this.contact.account = this.contact.account || ""; // Patch to handle stored information without account
	}

	load(id, token) {
		if (token === undefined) {
			let tokens = this.Storage.get(StorageKeys.tokens) || this.Storage.get("Tokens") || {};
			token = tokens[this.Competition.id];
		}

		if (token !== undefined) {
			this.Server.loadRegistration(id, token, json => {
				this.token = token;

				// Hack to compensate for server not storing organization
				// this.contact = new Person(json.contact);
				let newContact = new Person(json.contact);
				newContact.organization = this.contact.organization;
				this.contact = newContact;

				// Loading participants from json
				let newParticipants = [];
				json.registration.forEach(entry => {
					let p = entry.participant;
					newParticipants.push(new Participant({ name: p.name, competitionId: p.id, organization: p.organization }, entry.entries));
				});
				this.participants = newParticipants;

				this.fire(this.Events.registrationUpdated, this);
			});
		} else {
			this.token = undefined;
			this.contact = new Person();
			this.participants = [];
		}
	}

	addParticipant(p) {
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(this.Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		this.participants.push(new Participant(p));
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

	setParticipantEvent(participant, event, value) {
		this.getParticipant(participant).setParticipate(event, value);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantClass(participant, event, value) {
		this.getParticipant(participant).addEvent(event).class = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	addParticipantRound(participant, event) {
		this.getParticipant(participant).addEvent(event).rounds.push({});
		this.fire(this.Events.registrationUpdated, this);
	}

	deleteParticipantRound(participant, event, round) {
		this.getParticipant(participant).event(event).rounds.splice(round, 1);
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantDivision(participant, event, round, value) {
		this.getParticipant(participant).addEvent(event).rounds[round].division = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	setParticipantSlot(participant, event, round, value) {
		this.getParticipant(participant).addEvent(event).rounds[round].slot = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	setContactField(field, value) {
		if (field === "account" && (value.length > 8 || !(/^\d*[-]?\d*$/.test(value)))) { return; } // Add more validation rules later?
		this.contact[field] = value;
		this.fire(this.Events.registrationUpdated, this);
	}

	countEvents() {
		let events = 0;
		this.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	sendRegistration() {
		if (window._debug) { console.log("Sending registration"); }
		this.Registry.storeCompetitors(this.participants);
		this.Storage.set("Contact", this.contact);
		this.Server.sendRegistration(this)
			.then(res => {
				if (window._debug) { console.log(res.token); }
				this.token = res.token;
				let tokens = this.Storage.get(StorageKeys.tokens) || this.Storage.get("Tokens") || [];
				tokens[this.Competition.id] = res.token;
				this.Storage.set(StorageKeys.tokens, tokens);
				this.Footers.addFooter(this.countEvents() + " starter registrerade", "info");
				this.fire(this.Events.registrationUpdated, this);
			})
			.catch(error => {
				if (window._debug) { console.log(error); }
				this.Footers.addFooter(`Registreringen misslyckades! (${error})`);
			});
	}

	register() {
		let errors = new Validation(this.Competition).validate(this.participants);
		if (errors.length === 0) {
			this.sendRegistration();
		} else {
			this.Footers.addFooter(errors.length === 1 ? errors[0].error : errors.length + " fel hindrar registrering!");
			this.fire(this.Events.registrationUpdated, this);
		}
	}
}