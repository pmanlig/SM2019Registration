import './TeamView.css';
import React from 'react';
import { Description, NewRegistrationContact, TeamForm } from '../components';

export class TeamView extends React.Component {
	static register = { name: "TeamView" };
	static wire = ["EventBus", "Events", "Server", "Competition", "Footers", "NewRegistrationContact", "TeamRegistration"];

	constructor(props) {
		super(props);
		this.state = { name: "", organization: "", email: "", state: "" };
	}

	onChange = (prop, value) => {
		switch (prop) {
			case "name":
				this.setState({ name: value });
				break;
			case "organization":
				this.setState({ organization: value });
				break;
			case "email":
				this.setState({ email: value });
				break;
			case "account":
				this.setState({ account: value });
				break;
			default:
				break;
		}
	}

	render() {
		let { name, organization, email, account } = this.state;
		return <div>
			<Description value={this.Competition.description} />
			<NewRegistrationContact name={name} organization={organization} email={email} account={account} showAccount="true" onChange={this.onChange} />
			{this.Competition.events.map(e => <TeamForm key={e.id} competition={this.Competition} event={e}/>)}
		</div>;
	}
}