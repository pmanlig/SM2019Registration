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

	render() {
		if (this.Registration.token !== undefined && this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.props.match.params.id}/register/${this.Registration.token}`} />
		}

		return <div>
			<this.SquadPicker />
			<div className="content">{this.Competition.description}</div>
			<this.RegistrationContact />
			<this.RegistrationForm />
			<this.Summary />
			<this.RegistrationToolbar />
			<this.ParticipantPicker />
			<this.YesNoDialog title="Bekräfta borttagning" text="Är du säker på att du vill radera deltagaren?" visible={this.state.deleteParticipant !== undefined} action={act => this.deleteParticipant(act)} />
		</div>;
	}
}