import { Person, CompetitionInfo } from './models';
import { Validation } from './logic';

export class ApplicationState {
	static instance;

	registry = [];
	registration = [];
	storeParticipants = "Nej";
	competitionInfo = new CompetitionInfo("noComp", "No Competition");

	// Event handlers
	updateState;
	addMessage;

	constructor(updateState, addMessage) {
		this.updateState = updateState;
		this.addMessage = addMessage;
	}

	setCompetitionInfo(info) {
		this.competitionInfo = CompetitionInfo.fromJson(info);
	}

	storeCompetitors = () => {
		let competitors = this.registration.map(p => new Person(p));
		this.registry.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.registry = competitors;
	}

	validateRegistration = () => {
		let errors = [];
		let v = new Validation(this.competitionInfo, errors);
		this.registration.forEach(p => { p.error = false; v.validateParticipant(p); });
		errors.forEach(e => { e.participant.error = true; });
		return errors;
	}

	eventList(registrationInfo) {
		let events = [];
		for (let i = 0; i < registrationInfo.length; i++) {
			if (registrationInfo[i]) {
				events.push({ event: this.competitionInfo.events[i].id });
			}
		}
		return events;
	}

	registrationJson() {
		return JSON.stringify(
			{
				competition: this.competitionInfo.id,
				contact: { name: "", email: "" },
				registration: this.registration.map(p => {
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

	sendRegistration = () => {
		this.addMessage("Starter registrerade", "info");
		this.storeCompetitors();
		// this.updateState({ waiting: true });
		console.log(JSON.parse(this.registrationJson()));
		fetch("https://dev.bitnux.com/sm2019/register", {
			crossDomain: true,
			method: 'POST',
			body: this.registrationJson(),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		})
			.then(res => res.json())
			.catch(error => console.error('Error:', error))
			.then(response => console.log('Success:', response));
		this.updateState({ waiting: false });
	}

	register = () => {
		let errors = this.validateRegistration();
		switch (errors.length) {
			case 0:
				this.sendRegistration();
				break;
			case 1:
				this.addMessage(errors[0].error);
				break;
			default:
				this.addMessage(errors.length + " fel vid registrering!");
				break;
		}
	}
}