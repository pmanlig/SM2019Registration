import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "RegistrationToolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "SquadPicker", "Server", "YesNoDialog", "ParticipantToolbar"];
	static dateFormat = new Intl.DateTimeFormat('sv-SV');

	constructor(props) {
		super(props);
		this.state = {
			dates: [...new Set(this.Competition.events.map(e => RegistrationView.dateFormat.format(e.date)))],
			selected: RegistrationView.dateFormat.format(this.Competition.events[0].date)
		};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registrationUpdated, () => this.setState({}));
		this.subscribe(this.Events.deleteParticipant, (id) => this.showDeleteDialog(id));
		this.Registration.load(props.match.params.id, props.match.params.token);
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

	link = a => {
		return a && <a href={a}>{a}</a>;
	}

	linkify = (t, c) => {
		let p = 1;
		if (t.includes("[") && t.includes("]")) {
			return t.split("]").map(s => <span key={p++}>{s.split("[")[0]}{this.link(s.split("[")[1])}</span>).concat([<br key={p++} />]);
		}
		return <span key={c}>{t}<br /></span>;
	}

	Description = ({ value }) => {
		if (value == null || value === "") { return null; }
		let c = 1;
		return <div className="content">{value.split("\n").map(t => this.linkify(t, c++))}</div>;
	}

	EventFilter = ({ dates, selected }) => {
		if (dates == null || dates.length < 2) { return null; }
		return <div className="content">
			{[...dates].map(d => <button key={d} className={"button" + (selected === d ? "" : " white")} onClick={() => this.setState({ selected: d })}>{d}</button>)}
		</div>;
	}

	render() {
		if (this.Registration.token === undefined && this.props.match.params.token !== undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register`} />
		}

		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		let events = this.Competition.events.filter(e => RegistrationView.dateFormat.format(e.date) === this.state.selected);

		return <div>
			<this.SquadPicker />
			<this.Description value={this.Competition.description} />
			<this.RegistrationContact />
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