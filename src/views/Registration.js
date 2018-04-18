import React, { Component } from 'react';
import { Summary } from '../components';
import { EventBus } from '../EventBus';
import { CompetitionInfo, Participant } from '../models';
import { Validation } from '../Validation';

export class Registration extends Component {

	/*** Initialization & Liftcycle ***************************************************************************************/

	constructor(props) {
		super(props);
		this.state = { info: new CompetitionInfo(props.match.params.id, "", ""), participants: [] };
		this.setTitle("Anmälan till " + this.state.info.description);
		this.loadRegistrationDefinition();
	}

	componentDidMount() {
		this.addSubscription = this.props.injector.inject("EventBus").subscribe(EventBus.addParticipant, this.addParticipant.bind(this));
		this.deleteSubscription = this.props.injector.inject("EventBus").subscribe(EventBus.deleteParticipant, this.deleteParticipant.bind(this));
		this.registerSubscription = this.props.injector.inject("EventBus").subscribe(EventBus.register, this.register.bind(this));
	}

	componentWillUnmount() {
		this.addSubscription.unsubscribe();
		this.deleteSubscription.unsubscribe();
		this.registerSubscription.unsubscribe();
	}

	loadRegistrationDefinition() {
		this.props.injector.inject("Busy").setBusy("Registration", true);
		let id = parseInt(this.props.match.params.id, 10);
		fetch(isNaN(id) ? '/' + this.props.match.params.id + '.json' : 'https://dev.bitnux.com/sm2019/competition/' + id)
			.then(result => result.json())
			.then(json => {
				this.setState({ info: CompetitionInfo.fromJson(json) });
				this.props.injector.inject("Busy").setBusy("Registration", false);
				this.setTitle("Anmälan till " + json.description);
			})
			.catch(e => console.log(e));
	}

	/*** Event handlers ***************************************************************************************/

	setTitle(title) {
		this.props.injector.inject("EventBus").fire(EventBus.changeTitle, title);
	}

	addParticipant(p) {
		console.log("Adding new participant");

		// ToDo: Need to extend to support different scenarios
		let registrationInfo = [];
		this.state.info.eventGroups.forEach(eg => {
			eg.events.forEach(e => {
				registrationInfo.push(false);
			});
		});

		this.setState({ participants: this.state.participants.concat([new Participant(p, registrationInfo)]) });
	}

	deleteParticipant(id) {
		console.log("Deleting participant #" + id);
		this.setState({participants: this.state.participants.filter(p => { return p.id !== id; })});
	}

	register() {
		let errors = new Validation(this.state.info).validate(this.state.participants);
		switch (errors.length) {
			case 0:
				// this.sendRegistration();
				this.props.injector.inject("Footers").addFooter("Starter registrerade", "info");
				break;
			case 1:
				this.props.injector.inject("Footers").addFooter(errors[0].error);
				break;
			default:
				this.props.injector.inject("Footers").addFooter(errors.length + " fel hindrar registrering!");
				break;
		}
		this.setState({});
	}

	/*** render() ***************************************************************************************/

	render() {
		const ParticipantPicker = this.props.injector.inject("ParticipantPicker");
		const Toolbar = this.props.injector.inject("Toolbar");
		const RegistrationContact = this.props.injector.inject("RegistrationContact");
		const RegistrationForm = this.props.injector.inject("RegistrationForm");
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