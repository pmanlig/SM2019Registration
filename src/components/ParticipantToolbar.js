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
			{this.Registry.competitors.length > 0 &&
				<input type='button' className="button" id="getButton" onClick={e => this.fire(this.Events.showParticipantPicker)} value='Hämta deltagare' />}
			<input type='button' className="button" id="addButton" onClick={e => this.Registration.addParticipant()} value='Lägg till deltagare' />
		</div>;
	}
}