import "./RegistrationToolbar.css";
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
	static wire = ["subscribe", "fire", "Registration", "Registry", "Storage", "EventBus", "Events"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registryUpdated, () => this.setState({}));
	}

	render() {
		return <div className="buttons center content" style={{ position: "relative", overflow: "visible" }}>
			<input type='button' className="button" id="addButton" onClick={e => this.Registration.addParticipant()} value='Lägg till deltagare' />
			{this.Registry.competitors.length > 0 &&
				<input type='button' className="button" id="getButton" onClick={e => this.fire(this.Events.showParticipantPicker)} value='Hämta deltagare' />}
			<button className={this.Registration.participants.length === 0 ? "button disabled tooltip" : "button"} id="registerButton" onClick={e => this.fire(this.Events.registerForCompetition)}
				style={{ position: "relative" }} tooltip="Klicka här för att anmäla starter när du har lagt till alla skyttar och starter du vill anmäla" tooltip-position="right">Registrera starter</button>
		</div>
	}
}