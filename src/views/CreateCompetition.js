import "./CreateCompetition.css";
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Event } from "../models";

export class CreateCompetition extends React.Component {
	static register = { name: "CreateCompetition" };
	static wire = ["Storage", "Competition", "CompetitionProperties", "EventBus", "Events", "Server", "Footers"];

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
				data.events.push(new Event(1, data.event.name, new Date(data.event.date)));
				this.Competition.nextNewEvent = 2;
			}
			if (data.events.length === 0) {
				data.events.push(new Event(1, "", new Date()));
				this.Competition.nextNewEvent = 2;
			}
		}
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			if (this.state.redirect === undefined) {
				this.Storage.set(this.Storage.keys.newCompetition, this.Competition.toJson());
			} else {
				if (window._debug)
					console.log("Suppressing store due to redirect");
			}
		});
		this.Competition.initialize();
		this.Competition.fromJson(data);
	}

	createCompetition = () => {
		if (this.Competition.name === "") {
			this.Footers.addFooter("Tävlingen måste ha ett namn!");
			return;
		}
		this.Server.createCompetition(this.Competition.toJson(), response => {
			// ToDo: unsub?
			this.Storage.set(this.Storage.keys.newCompetition, null);
			this.setState({ redirect: response.id });
		}, this.Footers.errorHandler("Kan inte skapa tävling"));
	}

	clearForm = () => {
		this.Competition.initialize();
		this.Storage.set(this.Storage.keys.newCompetition, null);
		this.setState({});
	}

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Skapa ny tävling");
	}

	render() {
		if (this.state.redirect) { return <Redirect to={`/competition/${this.state.redirect}/admin`} />; }
		return <div className="content">
			<button id="saveButton" className="createTool button" onClick={this.createCompetition}>Skapa tävling</button>
			<button id="clearButton" className="createTool button" onClick={this.clearForm}>Rensa formulär</button>
			<this.CompetitionProperties />
		</div >;
	}
}