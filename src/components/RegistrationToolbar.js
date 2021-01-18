import "./Toolbar.css";
import "../general/Tooltip.css";
import React from 'react';

export function Label({ text, align, children }) {
	return <div className="label-box " style={{ alignItems: align }}>
		<p>{text}</p>
		{children}
	</div>;
}

export function ButtonToolbar({ className, children }) {
	return <div className={"toolbar " + className}>{children}</div>;
}

export class RegistrationToolbar extends React.Component {
	static register = { name: "RegistrationToolbar" };
	static wire = ["Registration", "Registry", "Storage", "EventBus", "Events", "Session", "YesNoDialog"];

	constructor(props) {
		super(props);
		this.state = { showDialog: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registryUpdated, () => this.setState({}));
		this.Registry.initialize();
	}

	deleteRegistration = (act) => {
		if (act) {
			this.Registration.deleteRegistration();
		}
		this.setState({ showDialog: false });
	}

	render() {
		return <div className="buttons center content" style={{ position: "relative", overflow: "visible" }}>
			{this.state.showDialog && <this.YesNoDialog title="Bekräfta avregistrering" text="Är du säker på att du vill ta bort anmälan?" action={this.deleteRegistration} />}
			<button className={this.Registration.participants.length === 0 ? "button disabled tooltip" : "button"} id="registerButton" onClick={e => this.fire(this.Events.registerForCompetition)}
				style={{ position: "relative" }} tooltip="Klicka här för att anmäla starter när du har lagt till alla skyttar och starter du vill anmäla" tooltip-position="right">{this.Registration.token ? "Uppdatera anmälan" : "Anmäl starter"}</button>
			{this.Registration.token && <button className="button unfocus" onClick={e => this.setState({ showDialog: true })}>Ta bort anmälan</button>}
			{this.Registration.token && this.Session.user !== "" && <input type="button" className="button unfocus" onClick={this.Registration.newRegistration} value="Rensa anmälan" />}
		</div>
	}
}