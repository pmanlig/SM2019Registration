import './CompetitionProperties.css';
import React from 'react';
import { InjectedComponent, Components, Events } from '../logic';
import { Event } from '.';

export class CompetitionProperties extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
	}

	render() {
		let competition = this.props.inject(Components.Competition);
		let id = 0;
		return <div>
			<table className="competitionInfo">
				<tbody>
					<tr>
						<th>Namn</th>
						<td><input type="text" value={competition.name} size="50" placeholder="Namn" onChange={e => competition.setName(e.target.value)} /></td>
					</tr>
					<tr>
						<th>Beskrivning</th>
						<td><input type="text" value={competition.description} size="50" placeholder="Beskrivning" onChange={e => competition.setDescription(e.target.value)} /></td>
					</tr>
					<tr>
						<th>Lägg till deltävling</th>
						<td>
							<button id="addEventButton" className="button-add" onClick={e => competition.addEvent()} />
						</td>
					</tr>
				</tbody>
			</table>
			{competition.events.map(e => <Event key={id++} event={e} onDelete={competition.events.length > 1 ? e => competition.removeEvent(e) : undefined} />)}
		</div>;
	}
}