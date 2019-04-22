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

	render() {
		let { classGroups, divisionGroups } = this.state;
		return <div>
			<this.ScheduleProperties divisionGroups={divisionGroups} />
			<table className="competitionInfo">
				<tbody>
					<tr>
						<th>Namn</th>
						<td><input type="text" value={this.Competition.name} size="50" placeholder="Namn" onChange={e => this.Competition.setProperty("name", e.target.value)} /></td>
					</tr>
					<tr>
						<th>Beskrivning</th>
						<td>
							<textarea rows="8" cols="50" placeholder="Beskrivning" onChange={e => this.Competition.setProperty("description", e.target.value)} value={this.Competition.description} />
						</td>
					</tr>
					<tr>
						<th>Status</th>
						<td>
							<Dropdown className="eventProperty" value={this.Competition.status} list={this.status} onChange={e => this.Competition.setProperty("status", parseInt(e.target.value, 10))} />
						</td>
					</tr>
					<tr>
						<th>Lägg till deltävling</th>
						<td>
							<button id="addEventButton" className="button-add green" onClick={e => this.Competition.addEvent()} />
						</td>
					</tr>
				</tbody>
			</table>
			{this.Competition.events.map(e => <this.EventProperties key={e.id} event={e} classGroups={classGroups} divisionGroups={divisionGroups} />)}
		</div>;
	}
}