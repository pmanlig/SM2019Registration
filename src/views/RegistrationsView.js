import './RegistrationsView.css';
import React from 'react';
import { Link } from 'react-router-dom';

export class RegistrationsView extends React.Component {
	static register = { name: "RegistrationsView" };
	static wire = ["Server", "Competition", "Configuration"];

	constructor(props) {
		super(props);
		this.state = { registrations: [] };
		this.Server.getRegistrations(this.Competition.id, json => {
			this.setState({ registrations: json });
		});
	}

	resendMail = (reg) => {
		this.Server.sendNewToken({ competition: this.Competition.id, email: "patrik@manlig.org"/*reg.email*/ }, json => {
			console.log("Token sent");
			console.log(json);
		});
	}

	Reg = ({ reg }) => {
		return <div className="registration-link">
			<button className="registration-button tooltip" tooltip="Skicka ny bekräftelse" tooltip-position="right" onClick={() => this.resendMail(reg)} >&#8635;</button>
			<a className="registration-button tooltip" tooltip="Skicka mail till anmälaren" tooltip-position="right" href={`mailto:${reg.email}`} >&#9993;</a>
			<Link to={`/competition/${this.Competition.id}/register/${reg.token}`}>{reg.contact}, {reg.organization} &lt;{reg.email}&gt;</Link>
		</div>;
	}

	render() {
		return <div className="content">
			<h2>Listor</h2>
			<a href={`${this.Configuration.baseUrl}/excel/${this.Competition.id}/division`} download="true">Alla deltagare (vapenkontroll)</a><br />
			{this.Competition.events.map(e => <a key={`d${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/list`} download="true">{`Deltagare i ${e.name}`}<br /></a>)}
			{this.Competition.events.map(e => <a key={`s${e.id}`} href={`${this.Configuration.baseUrl}/excel/${e.id}/squad`} download="true">{`Starttider i ${e.name}`}<br /></a>)}
			<h2>Anmälningar</h2>
			{this.state.registrations.map(r => <this.Reg reg={r} key={r.token} />)}
		</div>;
	}
}