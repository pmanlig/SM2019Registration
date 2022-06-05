import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, TabInfo } from '../models';

export class TeamAdminView extends React.Component {
	static register = { name: "TeamAdminView" };
	static wire = ["Server", "Competition", "Configuration", "Events", "EventBus", "Footers"];
	static tabInfo = new TabInfo("Administrera lag", "teamadmin", 202, Permissions.Admin);

	constructor(props) {
		super(props);
		this.state = { registrations: [] };
		this.Server.getTeamRegistrations(this.Competition.id, json => {
			this.setState({ registrations: json });
		});
		this.EventBus.manageEvents(this);
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Administrera anmälningar till ${this.Competition.name}`);
	}

	resendMail = (reg) => {
		this.Server.sendNewToken({ competition: this.Competition.id, email: reg.email }, json => {
			this.Footers.addFooter("Nytt mail skickas", "info");
		});
	}

	Reg = ({ reg }) => {
		return <div className="registration-link">
			<button className="registration-button tooltip" tooltip="Skicka ny bekräftelse" tooltip-position="right" onClick={() => this.resendMail(reg)} >&#8635;</button>
			<a className="registration-button tooltip" tooltip="Skicka mail till anmälaren" tooltip-position="right" href={`mailto:${reg.email}`} >&#9993;</a>
			<Link to={`/competition/${this.Competition.id}/teams/${reg.token}`}>{reg.organization} &lt;{reg.email}&gt;</Link>
		</div>;
	}

	Lists = props => {
		return <div>
			<h2>Listor</h2>
			{/*
			<a href={`${this.Configuration.baseUrl}/excel/${this.Competition.id}/division`} download="true">Alla deltagare (vapenkontroll)</a><br />
			{this.Competition.events.map(e => <a key={`d${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/list`} download="true">{`Deltagare i ${e.name}`}<br /></a>)}
			{this.Competition.events.map(e => <a key={`s${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/squad`} download="true">{`Starttider i ${e.name}`}<br /></a>)}
			*/}
		</div>;
	}

	Registrations = props => {
		return <div>
			<h2>Anmälningar</h2>
			{this.state.registrations.map(r => <this.Reg reg={r} key={r.token} />)}
		</div>;
	}

	render() {
		return <div className="content">
			<this.Lists />
			<this.Registrations />
		</div>;
	}
}