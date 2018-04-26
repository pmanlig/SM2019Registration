import { InjectedClass, Components, Resources, Events, Cookies } from '../logic';
import { CompetitionInfo, Participant, Person } from '.';
import { Validation } from '../logic';

export class RegistrationInfo extends InjectedClass {
	competition = new CompetitionInfo(0, "", "");
	participants = [];
	contact = new Person();

	constructor(injector) {
		super(injector);
		this.tokens = this.inject(Components.Storage).get("Tokens");
		this.subscribe(Events.setRegistrationInfo, this.updateContactField.bind(this));
		this.subscribe(Events.addParticipant, this.addParticipant.bind(this));
		this.subscribe(Events.deleteParticipant, this.deleteParticipant.bind(this));
		this.subscribe(Events.setParticipantName, this.setParticipantName.bind(this));
		this.subscribe(Events.setParticipantCompetitionId, this.setParticipantCompetitionId.bind(this));
		this.subscribe(Events.setParticipantOrganization, this.setParticipantOrganization.bind(this));
		this.subscribe(Events.setParticipantDivision, this.setParticipantDivision.bind(this));
		this.subscribe(Events.register, () => this.register());
		injector.loadResource(Resources.cookies, c => {
			let storedContact = this.inject(Components.Cookies).contact;
			if (storedContact !== undefined) {
				storedContact = JSON.parse(storedContact);
				this.contact = storedContact;
				injector.fire(Events.registrationUpdated, this);
			}
		});
	}

	createRegistrationInfo(reg) {
		// ToDo: Need to extend to support different scenarios
		let registrationInfo = [];
		this.competition.eventGroups.forEach(eg => {
			eg.events.forEach(e => registrationInfo.push((reg !== undefined) && reg.find(r => r.event === e) !== undefined));
		});
		return registrationInfo;
	}

	addParticipant(p, reg) {
		console.log("Adding new participant");
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(Events.addFooter, "Deltagaren finns redan!");
			return;
		}
		this.participants.push(new Participant(p, this.createRegistrationInfo(reg)));
		this.fire(Events.registrationUpdated, this);
	}

	deleteParticipant(id) {
		console.log("Deleting participant #" + id);
		this.participants = this.participants.filter(p => { return p.id !== id; });
		this.fire(Events.registrationUpdated, this);
	}

	setParticipantName(id, value) {
		this.participants.forEach(p => { if (id === p.id) p.name = value; });
		this.fire(Events.registrationUpdated, this);
	}

	setParticipantCompetitionId(id, value) {
		if (value.length < 6 && /^\d*$/.test(value)) {
			this.participants.forEach(p => { if (id === p.id) p.competitionId = value; });
			this.fire(Events.registrationUpdated, this);
		}
	}

	setParticipantOrganization(id, value) {
		this.participants.forEach(p => { if (id === p.id) p.organization = value; });
		this.fire(Events.registrationUpdated, this);
	}

	setParticipantDivision(participant, division, value) {
		this.participants.forEach(p => { if (participant === p.id) p.registrationInfo[division] = value; });
		this.fire(Events.registrationUpdated, this);
	}

	updateContactField(field, value) {
		this.contact[field] = value;
		this.fire(Events.registrationUpdated, this);
	}

	loadCompetition(id, token) {
		this.inject(Components.Server).loadCompetition(id, json => {
			this.competition = CompetitionInfo.fromJson(json);
			this.fire(Events.changeTitle, "Anmälan till " + json.description);
			this.fire(Events.registrationUpdated, this);
			if (token !== undefined) {
				this.inject(Components.Server).loadRegistration(id, token, json => {
					this.competition.token = token;

					// Hack to compensate for server not storing organization
					// this.contact = new Person(json.contact);
					let newContact = new Person(json.contact);
					newContact.organization = this.contact.organization;
					this.contact = newContact;

					// Loading participants from json
					this.participants = [];
					json.registration.forEach(entry => {
						let p = entry.participant;
						this.addParticipant({ name: p.name, competitionId: p.id, organization: p.organization }, entry.entries);
					});

					this.fire(Events.registrationUpdated, this);
				});
			}
		});
	}

	countEvents() {
		let events = 0;
		this.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	sendRegistration() {
		this.inject(Components.Registry).storeCompetitors(this.participants);
		this.inject(Components.Cookies).setCookie(Cookies.contact, JSON.stringify(this.contact));
		this.inject(Components.Storage).set("Contact", this.contact);
		this.inject(Components.Server).sendRegistration(this)
			.then(res => {
				console.log(res.token);
				this.tokens[this.competition.id] = res.token;
				this.inject(Components.Storage).set("Tokens", this.tokens);
				this.inject(Components.Footers).addFooter(this.countEvents() + " starter registrerade", "info");
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
		}
		this.fire(Events.registrationUpdated, this);
	}
}