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
		return JSON.stringify({
			competition: this.registration.competition.id,
			contact: { name: this.registration.contact.name, email: this.registration.contact.email },
			token: this.registration.token,
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

	sendRegistration() {
		this.inject(Components.Registry).storeCompetitors(this.registration.participants);
		this.inject(Components.Cookies).setCookie(Cookies.contact, JSON.stringify(this.registration.contact));
		console.log(this.registrationJson());
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
					res.json().then(json => {
						this.registration.token = json.token;
					});
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
			let storedContact = this.inject(Components.Cookies).contact;
			if (storedContact !== undefined) {
				storedContact = JSON.parse(storedContact);
				this.contact = storedContact;
				injector.fire(Events.registrationUpdated, this);
			}
		});
	}

	loadCompetition(id) {
		const test_token = "28459934f5768acbcddb1a7bff4a27b707a394cfebd88427c558cfe6c405505fef98e947210dc0e616fdc9adb0f2f6bbe6928b01094437d9a203d12d36eadcb6";
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