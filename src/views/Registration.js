import React from 'react';
import { Components, Events } from '.';
import { InjectedComponent } from '../components';
import { CompetitionInfo, Participant, Person } from '../models';
import { Validation } from '../logic';

export class Registration extends InjectedComponent {

	/*** Initialization & Liftcycle ***************************************************************************************/

	constructor(props) {
		super(props);
		this.state = { info: new CompetitionInfo(props.match.params.id, "", ""), participants: [], registrationContact: new Person() };
		this.fire(Events.changeTitle, "Anmälan till " + this.state.info.description);
		this.subscribe(Events.addParticipant, this.addParticipant.bind(this));
		this.subscribe(Events.deleteParticipant, this.deleteParticipant.bind(this));
		this.subscribe(Events.setParticipantName, this.setParticipantName.bind(this));
		this.subscribe(Events.setParticipantCompetitionId, this.setParticipantCompetitionId.bind(this));
		this.subscribe(Events.setParticipantOrganization, this.setParticipantOrganization.bind(this));
		this.subscribe(Events.setParticipantDivision, this.setParticipantDivision.bind(this));
		this.subscribe(Events.register, this.register.bind(this));
		this.loadRegistrationDefinition();
	}

	loadRegistrationDefinition() {
		const myId = "Registration";
		this.inject(Components.Busy).setBusy(myId, true);
		let id = parseInt(this.props.match.params.id, 10);
		fetch(isNaN(id) ? '/' + this.props.match.params.id + '.json' : 'https://dev.bitnux.com/sm2019/competition/' + id)
			.then(result => result.json())
			.then(json => {
				console.log(json);
				this.setState({ info: CompetitionInfo.fromJson(json) });
				this.inject(Components.Busy).setBusy(myId, false);
				this.fire(Events.changeTitle, "Anmälan till " + json.description);
			})
			.catch(e => console.log(e));
	}

	/*** Event handlers ***************************************************************************************/

	addParticipant(p) {
		console.log("Adding new participant");

		if (p !== undefined && this.state.participants.find(f => f.competitionId === p.competitionId) !== undefined) {
			this.inject(Components.Footers).addFooter("Deltagaren finns redan!");
		} else {
			// ToDo: Need to extend to support different scenarios
			let registrationInfo = [];
			this.state.info.eventGroups.forEach(eg => {
				eg.events.forEach(e => {
					registrationInfo.push(false);
				});
			});

			this.setState({ participants: this.state.participants.concat([new Participant(p, registrationInfo)]) });
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

	countEvents() {
		let events = 0;
		this.state.participants.forEach(p => { p.registrationInfo.forEach(r => { if (r) events++; }) });
		return events;
	}

	eventList(registrationInfo) {
		let events = [];
		for (let i = 0; i < registrationInfo.length; i++) {
			if (registrationInfo[i]) {
				events.push({ event: this.state.info.events[i].id });
			}
		}
		return events;
	}

	registrationJson() {
		// ToDo: replace test name/email with form data
		return JSON.stringify(
			{
				competition: this.state.info.id,
				contact: { name: "Patrik Manlig", email: "patrik@manlig.org" },
				registration: this.state.participants.map(p => {
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
		this.inject(Components.Registry).storeCompetitors(this.state.participants);
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
		let errors = new Validation(this.state.info).validate(this.state.participants);
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
		this.setState({});
	}

	/*** render() ***************************************************************************************/

	render() {
		const ParticipantPicker = this.inject(Components.ParticipantPicker);
		const Toolbar = this.inject(Components.Toolbar);
		const RegistrationContact = this.inject(Components.RegistrationContact);
		const RegistrationForm = this.inject(Components.RegistrationForm);
		const Summary = this.inject(Components.Summary);
		let id = 0;
		return [
			<RegistrationContact key={id++} />,
			<Toolbar key={id++} />,
			<RegistrationForm key={id++} info={this.state.info} participants={this.state.participants} />,
			<Summary key={id++} participants={this.state.participants} />,
			<ParticipantPicker key={id++} />
		];
	}
}