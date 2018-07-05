import { Events, StorageKeys, Components, Validation, InjectedClass } from '../logic';
import { Person, Participant } from '.';

export class Registration extends InjectedClass {
	competition = undefined;
	token = undefined;
	contact = new Person();
	participants = [];

	// ToDo: Rewrite to not use event handlers
	constructor(injector) {
		super(injector);
		this.competition = this.inject(Components.Competition);
		this.subscribe(Events.setRegistrationInfo, this.setContactField.bind(this));
		this.subscribe(Events.deleteParticipant, this.deleteParticipant.bind(this));
		this.subscribe(Events.setParticipantField, this.setParticipantField.bind(this));
		this.subscribe(Events.setParticipantDivision, this.setParticipantDivision.bind(this));
		this.subscribe(Events.register, () => this.register());
		this.contact = this.inject(Components.Storage).get("Contact") || new Person();
		this.contact.account = this.contact.account || ""; // Patch to handle stored information without account
	}

	load(id, token) {
		if (token === undefined) {
			let storage = this.inject(Components.Storage);
			let tokens = storage.get(StorageKeys.tokens) || storage.get("Tokens") || {};
			token = tokens[this.competition.id];
		}

		if (token !== undefined) {
			this.inject(Components.Server).loadRegistration(id, token, json => {
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

				this.fire(Events.registrationUpdated, this);
			});
		} else {
			this.token = undefined;
			this.contact = new Person();
			this.participants = [];
		}
	}

	addParticipant(p, reg) {
		console.log("Adding new participant");
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		this.participants.push(new Participant(p));
		this.fire(Events.registrationUpdated, this);
	}

	deleteParticipant(id) {
		console.log("Deleting participant #" + id);
		this.participants = this.participants.filter(p => { return p.id !== id; });
		this.fire(Events.registrationUpdated, this);
	}

	setParticipantField(id, field, value) {
		if (field === "competitionId" && (value.length > 5 || !(/^\d*$/.test(value)))) { return; } // Add more validation rules later?
		this.participants.forEach(p => { if (p.id === id) p[field].participate = value });
		this.fire(Events.registrationUpdated, this);
	}

	setParticipantDivision(participant, event, value) {
		this.participants.find(p => participant === p.id).setParticipate(event, value);
		this.fire(Events.registrationUpdated, this);
	}

	setContactField(field, value) {
		if (field === "account" && (value.length > 8 || !(/^\d*[-]?\d*$/.test(value)))) { return; } // Add more validation rules later?
		console.log("Updating field");
		this.contact[field] = value;
		this.fire(Events.registrationUpdated, this);
	}

	countEvents() {
		let events = 0;
		this.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	sendRegistration() {
		this.inject(Components.Registry).storeCompetitors(this.participants);
		this.inject(Components.Storage).set("Contact", this.contact);
		this.inject(Components.Server).sendRegistration(this)
			.then(res => {
				console.log(res.token);
				let storage = this.inject(Components.Storage);
				this.token = res.token;
				let tokens = storage.get(StorageKeys.tokens) || storage.get("Tokens") || [];
				tokens[this.competition.id] = res.token;
				storage.set(StorageKeys.tokens, tokens);
				this.inject(Components.Footers).addFooter(this.countEvents() + " starter registrerade", "info");
				this.fire(Events.registrationUpdated, this);
			})
			.catch(error => {
				console.log(error);
				this.inject(Components.Footers).addFooter("Registreringen misslyckades! (" + error + ")");
			});
	}

	register() {
		let errors = new Validation(this.competition).validate(this.participants);
		if (errors.length === 0) {
			this.sendRegistration();
		} else {
			this.inject(Components.Footers).addFooter(errors.length === 1 ? errors[0].error : errors.length + " fel hindrar registrering!");
			this.fire(Events.registrationUpdated, this);
		}
	}
}