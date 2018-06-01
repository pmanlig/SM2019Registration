import "./CreateCompetition.css";
import React from 'react';
import { Events, InjectedComponent, setCookie, getCookie } from '../logic';
import { withTitle, Event, EventList } from '../components';

export const CreateCompetition = withTitle("Skapa ny tävling", class extends InjectedComponent {
	constructor(props) {
		super(props);
		let data = JSON.parse(getCookie("newCompetition", undefined));
		if (data) {
			data.events.forEach(e => e.date = new Date(e.date));
			data.event.date = new Date(data.event.date);
		}
		this.state = data ||
			{
				name: "",
				description: "",
				multipleEvents: false,
				event: { name: "", date: new Date() },
				events: []
			};
	}

	updateState(newState) {
		newState = { ...this.state, ...newState };
		setCookie("newCompetition", JSON.stringify(newState));
		this.setState(newState);
	}

	updateName = (e) => {
		this.updateState({ name: e.target.value, event: { ...this.state.event, name: e.target.value } });
	}

	addEvent = (newEvent) => {
		if (newEvent === "") {
			this.fire(Events.addFooter, "Deltävlingen måste ha ett namn!");
		} else if (this.state.events.filter(e => e.name === newEvent).length === 0) {
			this.updateState({ events: [...this.state.events, { name: newEvent, date: new Date() }] });
		} else {
			this.fire(Events.addFooter, "Deltävlingen finns redan, välj ett unikt namn för att skapa ny deltävling!");
		}
	}

	removeEvent = (d) => {
		this.updateState({ events: this.state.events.filter(e => e.name !== d.name) });
	}

	setMultipleEvents = (e) => {
		this.updateState({ multipleEvents: e.target.value === "multiple" });
	}

	createCompetition = () => {
		console.log(this.state);
	}

	render() {
		// ToDo: Load disciplines dynamically
		return <div className="content">
			<button id="saveButton" className="button" onClick={this.createCompetition}>Skapa</button>
			<table className="competitionInfo">
				<tbody>
					<tr>
						<th>Namn</th>
						<td><input type="text" value={this.state.name} size="50" placeholder="Namn" onChange={this.updateName} /></td>
					</tr>
					<tr>
						<th>Beskrivning</th>
						<td><input type="text" value={this.state.description} size="50" placeholder="Beskrivning" onChange={e => this.setState({ description: e.target.value })} /></td>
					</tr>
					<tr>
						<th>Deltävlingar</th>
						<td>
							<div className="eventSelector">
								<label><input type="radio" name="multipleEvents" value="single" checked={!this.state.multipleEvents} onChange={this.setMultipleEvents} />Enbart huvudtävling</label>
								<label><input type="radio" name="multipleEvents" value="multiple" checked={this.state.multipleEvents} onChange={this.setMultipleEvents} />Deltävlingar</label>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="eventList">
				{this.state.multipleEvents ?
					<EventList events={this.state.events} addEvent={this.addEvent} removeEvent={this.removeEvent} /> :
					<Event event={this.state.event} />}
			</div>
		</div >;
	}
});