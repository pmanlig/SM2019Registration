import { InjectedClass, Components, Resources, Events } from '../logic';
import { CompetitionInfo, Participant, Person } from '.';

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
		injector.loadResource(Resources.cookies, c => {
			// ToDo: read cookie information here
			this.contact.name = "fromCookie";
			this.contact.organization = "fromCookie";
			this.contact.email = "from@cookie.com";
			injector.fire(Events.registrationUpdated, this);
		});
	}

	loadCompetition(id) {
		const myId = "Registration";
		this.inject(Components.Busy).setBusy(myId, true);
		let numId = parseInt(id, 10);
		fetch(isNaN(numId) ? '/' + id + '.json' : 'https://dev.bitnux.com/sm2019/competition/' + id)
			.then(result => result.json())
			.then(json => {
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
		this.setState({ participants: this.state.participants.filter(p => { return p.id !== id; }) });
	}

	setParticipantName(id, value) {
		this.state.participants.forEach(p => { if (id === p.id) p.name = value; });
		this.setState({});
	}

	setParticipantCompetitionId(id, value) {
		if (value.length < 6 && /^\d*$/.test(value)) {
			this.state.participants.forEach(p => { if (id === p.id) p.competitionId = value; });
			this.setState({});
		}
	}

	setParticipantOrganization(id, value) {
		this.state.participants.forEach(p => { if (id === p.id) p.organization = value; });
		this.setState({});
	}

	setParticipantDivision(participant, division, value) {
		this.state.participants.forEach(p => { if (participant === p.id) p.registrationInfo[division] = value; });
		this.setState({});
	}

	updateContactField(field, value) {
		this.contact[field] = value;
		this.fire(Events.registrationUpdated, this);
	}
}