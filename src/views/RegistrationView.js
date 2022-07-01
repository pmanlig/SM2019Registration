import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Permissions, Status, TabInfo } from '../models';
import { Description, NewRegistrationContact } from '../components';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "RegistrationToolbar",
		"RegistrationForm", "Summary", "SquadPicker", "Server", "YesNoDialog", "ParticipantToolbar"];
	static dateFormat = new Intl.DateTimeFormat('sv-SV');
	static tabInfo = new TabInfo("Anmälan", "register", 1, Permissions.Any, Status.Open);

	constructor(props) {
		super(props);
		this.state = {
			dates: [...new Set(this.Competition.events.map(e => RegistrationView.dateFormat.format(e.date)))],
			selected: RegistrationView.dateFormat.format(this.Competition.events[0].date)
		};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.subscribe(this.Events.deleteParticipant, (id) => this.showDeleteDialog(id));
		this.Registration.load(props.match.params.id, props.match.params.p1);
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Anmälan till " + this.Competition.name);
	}

	showDeleteDialog = id => {
		this.setState({ deleteParticipant: id });
	}

	deleteParticipant = (act) => {
		if (act) this.Registration.deleteParticipant(this.state.deleteParticipant);
		this.setState({ deleteParticipant: undefined });
	}

	EventFilter = ({ dates, selected }) => {
		if (dates == null || dates.length < 2) { return null; }
		return <div className="content">
			{[...dates].map(d => <button key={d} className={"button" + (selected === d ? "" : " white")} onClick={() => this.setState({ selected: d })}>{d}</button>)}
		</div>;
	}

	onChangeContact = (prop, value) => {
		this.fire(this.Events.setRegistrationInfo, prop, value);
	}

	render() {
		let { name, organization, email, account } = this.Registration.contact;

		if (this.Registration.token === undefined && this.props.match.params.p1 !== undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register`} />
		}

		if (this.Registration.token !== undefined && this.props.match.params.p1 === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		let events = this.Competition.events.filter(e => RegistrationView.dateFormat.format(e.date) === this.state.selected);

		return <div>
			<this.SquadPicker />
			<Description value={this.Competition.description} />
			<NewRegistrationContact name={name} organization={organization} email={email} account={account} showAccount={this.Competition.rules.includes("show-acct")} onChange={this.onChangeContact} />
			<this.EventFilter dates={this.state.dates} selected={this.state.selected} />
			<this.RegistrationForm events={events} />
			<this.ParticipantToolbar />
			<this.Summary />
			<this.RegistrationToolbar />
			<this.ParticipantPicker />
			{this.state.deleteParticipant !== undefined && <this.YesNoDialog title="Bekräfta borttagning" text="Är du säker på att du vill radera deltagaren?" action={act => this.deleteParticipant(act)} />}
		</div>;
	}
}