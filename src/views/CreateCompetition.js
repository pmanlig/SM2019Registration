import "./CreateCompetition.css";
import React from 'react';
import { Components, Events, InjectedComponent, StorageKeys } from '../logic';
import { withTitle } from '../components';

function Event({ event }) {
	return <li>
		<div className="eventTitle">
			<span>{event.name}</span>
			<button className="delete">x</button>
		</div>
		<input type="text" size="15" placeholder="Inget datum valt" />
		<select className="eventInfo">
			<option value="none">Inget schema</option>
			<option value="none">Nytt schema...</option>
		</select>
		<select className="eventInfo">
			<option value="none">Inga vapengrupper</option>
			<option value="none">Ny indelning...</option>
		</select>
		<select className="eventInfo">
			<option value="none">Ingen klassindelning</option>
			<option value="none">Ny indelning...</option>
		</select>
	</li>;
}

export const CreateCompetition = withTitle("Skapa ny tävling", class extends InjectedComponent {
	constructor(props) {
		super(props);
		// ToDo: Load settings
		this.inject(Components.Storage).get(StorageKeys.newCompetition);
		this.state = {
			name: "",
			description: "",
			events: []
		};
	}

	addEvent = () => {
		let newEvent = this.newEventName.value;
		if (this.state.events.filter(e => e.name === newEvent).length === 0) {
			this.setState({ events: this.state.events.concat([{ name: newEvent }]) });
		} else {
			this.fire(Events.addFooter, "Deltävlingen finns redan, välj ett unikt namn för att skapa ny deltävling!");
		}
	}

	render() {
		// ToDo: Load disciplines dynamically
		return <div className="content">
			<table>
				<tbody>
					<tr><th>Namn</th></tr>
					<tr><td><input type="text" value={this.state.name} size="50" placeholder="Namn" onChange={e => this.setState({ name: e.target.value })} /></td></tr>
					<tr><th>Beskrivning</th></tr>
					<tr><td><input type="text" value={this.state.description} size="50" placeholder="Beskrivning" onChange={e => this.setState({ description: e.target.value })} /></td></tr>
					<tr><th>Deltävlingar</th></tr>
					<tr><td><ul className="events">
						{this.state.events.map(e => { return <Event key={e.name} event={e} /> })}
					</ul></td></tr>
					<tr><td>
						<input type="text" size="25" placeholder="Namn på ny deltävling" ref={input => this.newEventName = input} />
						<button className="addEvent" onClick={this.addEvent}>+</button>
					</td></tr>
				</tbody>
			</table>
			<button id="saveButton" className="button">Skapa</button>
		</div>;
	}
});