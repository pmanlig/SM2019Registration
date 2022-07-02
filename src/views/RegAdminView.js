import './RegAdminView.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Permissions, TabInfo } from '../models';

/** List of registrations (one registration may contain several entries) */
export class RegAdminView extends React.Component {
	static register = { name: "RegAdminView" };
	static wire = ["Server", "Competition", "Configuration", "Events", "EventBus", "Footers"];
	static tabInfo = new TabInfo("Administrera anmälningar", "registrations", 201, Permissions.Admin);

	constructor(props) {
		super(props);
		this.state = { registrations: [] };
		this.Server.getRegistrations(this.Competition.id, json => {
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
			<Link to={`/competition/${this.Competition.id}/register/${reg.token}`}>{reg.contact}, {reg.organization} &lt;{reg.email}&gt;</Link>
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
			<this.Registrations />
		</div>;
	}
}