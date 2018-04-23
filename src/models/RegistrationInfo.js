import { InjectedClass, Components, Resources, Events, Cookies } from '../logic';
import { CompetitionInfo, Participant, Person } from '.';
import { Validation } from '../logic';

class SendRegistration extends InjectedClass {
	constructor(registration) {
		super(registration.injector);
		this.registration = registration;
	}

	countEvents() {
		let events = 0;
		this.registration.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	eventList(registrationInfo) {
		let events = [];
		for (let i = 0; i < registrationInfo.length; i++) {
			if (registrationInfo[i]) {
				events.push({ event: this.registration.competition.events[i].id });
			}
		}
		return events;
	}

	registrationJson() {
		// ToDo: replace test name/email with form data
		return JSON.stringify(
			{
				competition: this.registration.competition.id,
				contact: { name: "Patrik Manlig", email: "patrik@manlig.org" },
				registration: this.registration.participants.map(p => {
					return {
						participant: {
							name: p.name,
							id: p.competitionId,
							organization: p.organization
						},
						entries: this.eventList(p.registrationInfo)
					};
				})
			});
	}

	registrationJsonFake() {
		return JSON.stringify({
			"id": "1",
			"list": [{
				"name": "Johan S",
				"card_number": "12345",
				"club": "Gävle PK",
				"milsnabb": "ÖpC,B,A",
				"precision": "B,A"
			}, {
				"name": "Patrik M",
				"card_number": "5555",
				"club": "Gävle PK",
				"milsnabb": "ÖpC,B,A,R",
				"precision": "B,A",
				"falt": "ÖpC,B,A,R"
			}]
		});
	}

	sendRegistration() {
		this.inject(Components.Registry).storeCompetitors(this.registration.participants);
		this.inject(Components.Cookies).setCookie(Cookies.contact, JSON.stringify(this.registration.contact));
		console.log(JSON.parse(this.registrationJson()));
		fetch("https://dev.bitnux.com/sm2019/register", {
			crossDomain: true,
			method: 'POST',
			body: this.registrationJson(),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		})
			.then(res => {
				console.log(res);
				if (res.ok) {
					this.inject(Components.Footers).addFooter(this.countEvents() + " starter registrerade", "info");
				} else {
					res.json().then(json => {
						console.log(json);
						this.inject(Components.Footers).addFooter("Registreringen misslyckades! (" + json.message + ")")
					});
				}
			})
			.catch(error => {
				console.error('Error:', error);
				this.inject(Components.Footers).addFooter("Registreringen misslyckades! (" + error + ")");
			});
		// ToDo: show 
	}

	register() {
		let errors = new Validation(this.registration.competition).validate(this.registration.participants);
		switch (errors.length) {
			case 0:
				this.sendRegistration();
				break;
			case 1:
				this.inject(Components.Footers).addFooter(errors[0].error);
				break;
			default:
				this.inject(Components.Footers).addFooter(errors.length + " fel hindrar registrering!");
				break;
		}
	}
}

export class RegistrationInfo extends InjectedClass {
	competition = new CompetitionInfo(0, "", "");
	participants = [];
	contact = new Person();

	constructor(injector) {
		super(injector);
		this.subscribe(Events.setRegistrationInfo, this.updateContactField.bind(this));
		this.subscribe(Events.addParticipant, this.addParticipant.bind(this));
		this.subscribe(Events.deleteParticipant, this.deleteParticipant.bind(this));
		this.subscribe(Events.setParticipantName, this.setParticipantName.bind(this));
		this.subscribe(Events.setParticipantCompetitionId, this.setParticipantCompetitionId.bind(this));
		this.subscribe(Events.setParticipantOrganization, this.setParticipantOrganization.bind(this));
		this.subscribe(Events.setParticipantDivision, this.setParticipantDivision.bind(this));
		this.subscribe(Events.register, () => { new SendRegistration(this).register() });
		injector.loadResource(Resources.cookies, c => {
			let storedContact = JSON.parse(this.inject(Components.Cookies).contact);
			if (storedContact !== undefined) {
				this.contact = storedContact;
				injector.fire(Events.registrationUpdated, this);
			}
		});
	}

	loadCompetition(id) {
		const myId = "Registration";
		this.inject(Components.Busy).setBusy(myId, true);
		let numId = parseInt(id, 10);
		fetch(isNaN(numId) ? '/' + id + '.json' : 'https://dev.bitnux.com/sm2019/competition/' + id)
			.then(result => result.json())
			.then(json => {
				console.log("Competition information:");
				console.log(json);
				this.competition = CompetitionInfo.fromJson(json);
				this.inject(Components.Busy).setBusy(myId, false);
				this.fire(Events.changeTitle, "Anmälan till " + json.description);
				this.fire(Events.registrationUpdated, this);
			})
			.catch(e => console.log(e));
	}

	createRegistrationInfo() {
		// ToDo: Need to extend to support different scenarios
		let registrationInfo = [];
		this.competition.eventGroups.forEach(eg => {
			eg.events.forEach(e => {
				registrationInfo.push(false);
			});
		});
		return registrationInfo;
	}

	addParticipant(p) {
		console.log("Adding new participant");
		if (p !== undefined && this.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.fire(Events.addFooter, "Deltagaren finns redan!");
		} else {
			this.participants.push(new Participant(p, this.createRegistrationInfo()));
			this.fire(Events.registrationUpdated, this);
		}
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
}