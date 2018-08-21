import "./CreateCompetition.css";
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Event } from "../models";

export class CreateCompetition extends React.Component {
	static register = { name: "CreateCompetition" };
	static wire = ["Storage", "Competition", "CompetitionProperties", "WithLogin", "EventBus", "Events", "Server"];

	constructor(props) {
		super(props);
		this.state = {};
		let data = this.Storage.get(this.Storage.keys.newCompetition);
		if (data) {
			if (data.events) {
				// patch to compendate for debug service
				data.events.forEach(e => {
					if (e.schedule && e.schedule.id) {
						e.schedule = e.schedule.id;
					}
				});

				// deserialize date strings
				data.events.map(e => Event.fromJson(e));
			} else {
				data.events = [];
			}

			// handle old format
			if (data.event && data.events.length === 0) {
				data.events.push(new Event(data.event.name, new Date(data.event.date)));
			}
			if (data.events.length === 0) {
				data.events.push(new Event("", new Date()));
			}
		}
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			if (this.state.redirect === undefined) {
				this.Storage.set(this.Storage.keys.newCompetition, this.Competition.toJson());
			} else {
				console.log("Suppressing store due to redirect");
			}
		});
		this.Competition.initialize();
		this.Competition.loadFrom(data);
	}

	createCompetition = () => {
		this.Server.createCompetition(this.Competition.toJson(), id => {
			// ToDo: unsub?
			this.Storage.set(this.Storage.keys.newCompetition, null);
			this.setState({ redirect: id });
		});
	}

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Skapa ny tävling");
	}

	render() {
		if (this.state.redirect) { return <Redirect to={`/competition/${this.state.redirect}/admin`} />; }
		return <div className="content">
			<button id="saveButton" className="button" onClick={this.createCompetition}>Skapa tävling</button>
			<this.CompetitionProperties />
		</div >;
	}
}