import "./Toolbar.css";
import "../general/Tooltip.css";
import React from 'react';

export class ParticipantToolbar extends React.Component {
	static register = { name: "ParticipantToolbar" };
	static wire = ["Registration", "Registry", "Storage", "EventBus", "Events", "Session"];

	constructor(props) {
		super(props);
		this.state = { showDialog: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.registryUpdated, () => this.setState({}));
		this.Registry.initialize();
	}

	render() {
		return <div className="buttons center content" style={{ position: "relative", overflow: "visible" }}>
			<button className="button" id="addButton" onClick={e => this.Registration.addParticipant()}><div className="button button-add small green" /> Lägg till deltagare</button>
			<button className="button" id="meButton" onClick={e => this.Registration.addMe()}><div className="button button-add small green" /> Lägg till mig</button>
			<button className={this.Registry.competitors.length > 0 ? "button" : "button diabled"} id="getButton" onClick={e => this.fire(this.Events.showParticipantPicker)}><div className="button button-recycle small green" /> Hämta deltagare</button>
		</div>;
	}
}