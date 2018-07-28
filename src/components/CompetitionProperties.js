import './CompetitionProperties.css';
import React from 'react';
import { InjectedComponent, Components, Events } from '../logic';
import { Status } from '../models';
import { Event } from '.';

export class CompetitionProperties extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
	}

	render() {
		let competition = this.props.inject(Components.Competition);
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
							<select className="eventInfo" value={competition.status} onChange={e => competition.setProperty("status", e.target.value)}>
								<option value={Status.Hidden}>Gömd</option>
								<option value={Status.Open}>Öppen</option>
								<option value={Status.Closed}>Stängd</option>
							</select>
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
			{competition.events.map(e => <Event key={e.id} competition={competition} event={e} onDelete={competition.events.length > 1 ? e => competition.removeEvent(e) : undefined} />)}
		</div>;
	}
}