import React from 'react';
import { Components, Events } from '.';
import { InjectedComponent } from '../components';
import { CompetitionInfo, Person } from '../models';
import { Validation } from '../logic';

export class Registration extends InjectedComponent {

	/*** Initialization & Liftcycle ***************************************************************************************/

	constructor(props) {
		super(props);
		this.state = { info: new CompetitionInfo(props.match.params.id, "", ""), participants: [], registrationContact: new Person() }; // Remove
		this.fire(Events.changeTitle, "Anmälan till " + this.state.info.description); // Remove
		this.subscribe(Events.registrationUpdated, () => this.setState({}));
		this.subscribe(Events.register, this.register.bind(this));
		this.inject(Components.RegistrationInfo).loadCompetition(props.match.params.id);
	}

	/*** Event handlers ***************************************************************************************/

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
		const registrationInfo = this.inject(Components.RegistrationInfo);
		const ParticipantPicker = this.inject(Components.ParticipantPicker);
		const Toolbar = this.inject(Components.Toolbar);
		const RegistrationContact = this.inject(Components.RegistrationContact);
		const RegistrationForm = this.inject(Components.RegistrationForm);
		const Summary = this.inject(Components.Summary);
		let id = 0;
		return [
			<RegistrationContact key={id++} />,
			<Toolbar key={id++} />,
			<RegistrationForm key={id++} info={registrationInfo.competition} participants={registrationInfo.participants} />,
			<Summary key={id++} participants={registrationInfo.participants} />,
			<ParticipantPicker key={id++} />
		];
	}
}