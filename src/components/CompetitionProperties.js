import './CompetitionProperties.css';
import React from 'react';
import { InjectedComponent, Components, Events } from '../logic';
import { Status } from '../models';
import { Dropdown } from '.';

export class CompetitionProperties extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {};
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
	}

	render() {
		const EventInfo = this.inject(Components.EventProperties);
		let competition = this.inject(Components.Competition);
		return <div>
			<table className="competitionInfo">
				<tbody>
					<tr>
						<th>Namn</th>
						<td><input type="text" value={competition.name} size="50" placeholder="Namn" onChange={e => competition.setProperty("name", e.target.value)} /></td>
					</tr>
					<tr>
						<th>Beskrivning</th>
						<td><input type="text" value={competition.description} size="50" placeholder="Beskrivning" onChange={e => competition.setProperty("description", e.target.value)} /></td>
					</tr>
					<tr>
						<th>Status</th>
						<td>
							<Dropdown className="eventProperty" value={competition.status} list={[
								{ id: Status.Hidden, description: "Gömd" }, { id: Status.Open, description: "Öppen" }, { id: Status.Closed, description: "Stängd" }
							]} onChange={e => competition.setProperty("status", e.target.value)} />
						</td>
					</tr>
					<tr>
						<th>Lägg till deltävling</th>
						<td>
							<button id="addEventButton" className="button-add" onClick={e => competition.addEvent()} />
						</td>
					</tr>
				</tbody>
			</table>
			{competition.events.map(e => <EventInfo key={e.id} event={e} />)}
		</div>;
	}
}