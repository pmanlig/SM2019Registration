import './RegistrationView.css';
import React from 'react';
import { Redirect } from 'react-router-dom';

export class RegistrationView extends React.Component {
	static register = { name: "RegistrationView" };
	static wire = ["Competition", "EventBus", "Events", "Registration", "ParticipantPicker", "RegistrationToolbar",
		"RegistrationContact", "RegistrationForm", "Summary", "SquadPicker", "Server", "YesNoDialog"];

	constructor(props) {
		super(props);
		this.state = {};
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

	Description = props => {
		let c = 1;
		return <div className="content">{props.value.split("\n").map(t => this.linkify(t, c++))}</div>;
	}

	render() {
		if (this.Registration.token === undefined && this.props.match.params.token !== undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register`} />
		}

		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		return <div>
			<this.SquadPicker />
			<this.Description value={this.Competition.description} />
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.RegistrationToolbar />
			<this.ParticipantPicker />
			{this.state.deleteParticipant !== undefined && <this.YesNoDialog title="Bekräfta borttagning" text="Är du säker på att du vill radera deltagaren?" action={act => this.deleteParticipant(act)} />}
		</div>;
	}
}