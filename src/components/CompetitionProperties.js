import './CompetitionProperties.css';
import React from 'react';
import { Status } from '../models';
import { Dropdown } from '.';

let default_class_group = [{ id: -1, description: "Ingen klassindelning" }];
let default_division_group = [{ id: -1, description: "Inget val av vapengrupp" }];

export class CompetitionProperties extends React.Component {
	static register = { name: "CompetitionProperties" };
	static wire = ["Server", "Competition", "EventProperties", "ScheduleProperties", "EventBus", "Events", "DivisionGroups", "ClassGroups"]

	status = [{ id: Status.Hidden, description: "Gömd" }, { id: Status.Open, description: "Öppen" }, { id: Status.Closed, description: "Stängd" }];

	constructor(props) {
		super(props);
		this.state = {
			classGroups: default_class_group,
			divisionGroups: default_division_group
		};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => this.setState({}));
	}

	componentDidMount() {
		this.ClassGroups.load(list => this.setState({ classGroups: default_class_group.concat(list) }));
		this.DivisionGroups.load(list => this.setState({ divisionGroups: default_division_group.concat(list) }));
	}

	toggle50pct = e => {
		if (this.Competition.rules.includes("50pct")) {
			this.Competition.removeRule("50pct");
		} else {
			this.Competition.addRule("50pct");
		}
	}

	toggleShowAcct = e => {
		if (this.Competition.rules.includes("show-acct")) {
			this.Competition.removeRule("show-acct");
		} else {
			this.Competition.addRule("show-acct");
		}
	}

	render() {
		let { classGroups, divisionGroups } = this.state;
		return <div>
			<this.ScheduleProperties divisionGroups={divisionGroups} />
			<div id="competition-properties">
				<div style={{ gridArea: "competition-group-label" }} className="property-label">Grupp</div>
				<div style={{ gridArea: "competition-group-input" }}><input type="text" value={this.Competition.group} size="50" placeholder="Grupp" onChange={e => this.Competition.setProperty("group", e.target.value)} /></div>
				<div style={{ gridArea: "competition-name-label" }} className="property-label">Namn</div>
				<div style={{ gridArea: "competition-name-input" }}><input type="text" value={this.Competition.name} size="50" placeholder="Namn" onChange={e => this.Competition.setProperty("name", e.target.value)} /></div>
				<div style={{ gridArea: "competition-short-label" }} className="property-label">Underrubrik</div>
				<div style={{ gridArea: "competition-short-input" }}><input type="text" value={this.Competition.shortDesc} size="50" placeholder="Underrubrik" onChange={e => this.Competition.setProperty("shortDesc", e.target.value)} /></div>
				<div style={{ gridArea: "competition-desc-label" }} className="property-label">Beskrivning</div>
				<div style={{ gridArea: "competition-desc-input" }}><textarea rows="8" cols="50" placeholder="Beskrivning" onChange={e => this.Competition.setProperty("description", e.target.value)} value={this.Competition.description} /></div>
				<div style={{ gridArea: "competition-status-label" }} className="property-label">Status</div>
				<div style={{ gridArea: "competition-status-input" }}><Dropdown className="eventProperty" value={this.Competition.status} list={this.status} onChange={e => this.Competition.setProperty("status", parseInt(e.target.value, 10))} /></div>
				<div style={{ gridArea: "competition-50pct-label" }} className="property-label">Max 50% skyttar från samma förening</div>
				<div style={{ gridArea: "competition-50pct-input" }}><input type="checkbox" checked={this.Competition.rules.includes("50pct")} onChange={this.toggle50pct} /></div>
				<div style={{ gridArea: "competition-show-acct-label" }} className="property-label">Visa fält för konto</div>
				<div style={{ gridArea: "competition-show-acct-input" }}><input type="checkbox" checked={this.Competition.rules.includes("show-acct")} onChange={this.toggleShowAcct} /></div>
			</div>
			<div>
				<div className="add-event"><button id="addEventButton" className="button-add green" onClick={e => this.Competition.addEvent()} />Lägg till deltävling</div>
				<div>
					{this.Competition.events.map(e => <this.EventProperties key={e.id} event={e} classGroups={classGroups} divisionGroups={divisionGroups} />)}
				</div>
			</div>
		</div>;
	}
}