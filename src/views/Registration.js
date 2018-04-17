import React, { Component } from 'react';
import { Summary } from '../components';
import { EventBus } from '../EventBus';
import { CompetitionInfo, Participant } from '../models';

export class Registration extends Component {
	constructor(props) {
		super(props);
		this.state = { info: new CompetitionInfo(props.match.params.id, "", ""), participants: [] };
		this.setTitle("Anmälan till " + this.state.info.description);
		this.loadRegistrationDefinition();
	}

	setTitle(title) {
		this.props.injector.inject("EventBus").fire(EventBus.changeTitle, title);
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

	addParticipant = p => {
		console.log("Adding new participant");

		// ToDo: Need to extend to support different scenarios
		let registrationInfo = [];
		this.state.info.eventGroups.forEach(eg => {
			eg.events.forEach(e => {
				registrationInfo.push(false);
			});
		});

		this.setState({participants: this.state.participants.concat([new Participant(p, registrationInfo)])});
	}

	componentDidMount() {
		this.addSubscription = this.props.injector.inject("EventBus").subscribe(EventBus.addParticipant, this.addParticipant);
	}

	componentWillUnmount() {
		this.addSubscription.unsubscribe();
	}

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
			<Summary key={id++} participants={this.state.participants}/>,
			<ParticipantPicker key={id++} />
		];
	}
}