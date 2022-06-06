import './EventProperties.css';
import './Tables.css';
import React from 'react';
import { ModalDialog } from '../general';
import { TeamDef } from '../models';
import { Spinner, Dropdown, TextInput } from '.';

export class TeamProperties extends React.Component {
	static register = { name: "TeamProperties" };
	static wire = ["EventBus", "Events", "Competition", "DivisionGroups", "ClassGroups"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.editTeams, e => this.setState({ event: e }));
		this.state = { dirty: false };
	}

	onClose = () => {
		this.setState({ event: undefined });
		if (this.state.dirty) { this.fire(this.Events.updateCompetition); }
	}

	addTeam = () => {
		this.state.event.teams.push(new TeamDef(undefined, undefined, 2, 1));
		this.setState({ dirty: true });
	}

	setMembers = (team, value) => {
		if (value > 0 && value !== team.members) {
			team.members = value;
			this.setState({ dirty: true });
		}
	}

	setAlternates = (team, value) => {
		if (value >= 0 && value !== team.alternates) {
			team.alternates = value;
			this.setState({ dirty: true });
		}
	}

	setDivision = (team, value) => {
		value = value.target.value;
		if (value === "-1") { value = undefined; }
		if (value !== team.division) {
			team.division = value;
			this.setState({ dirty: true });
		}
	}

	setClass = (team, value) => {
		value = value.target.value;
		if (value === "-1") { value = undefined; }
		if (value !== team.class) {
			team.class = value;
			this.setState({ dirty: true });
		}
	}

	setCost = (team, cost) => {
		if (cost !== team.cost) {
			team.cost = cost;
			this.setState({ dirty: true });
		}
	}

	deleteTeam = team => {
		let { event } = this.state;
		event.teams = event.teams.filter(t => t !== team);
		this.setState({ dirty: true });
	}

	Divisions = ({ team }) => {
		let { divisions } = this.state.event;
		if (divisions === undefined) return null;
		let divList = this.DivisionGroups.find(dg => dg.id === divisions);
		let list = [{ id: -1, description: "Alla" }].concat(divList.divisions.filter(d => !d.includes('+')).map(d => { return { id: d, description: d } }));
		return <td><Dropdown value={team.division || "Alla"} list={list} onChange={d => this.setDivision(team, d)} /></td>
	}

	Classes = ({ team }) => {
		let { classes } = this.state.event;
		if (classes === undefined) return null;
		let clsList = this.ClassGroups.find(cg => cg.id === classes);
		let list = [{ id: -1, description: "Alla" }].concat(clsList.classes.map(c => { return { id: c, description: c } }));
		return <td><Dropdown value={team.class || "Alla"} list={list} onChange={c => this.setClass(team, c)} /></td>
	}

	TeamRow = ({ team }) => {
		return <tr>
			<this.Divisions team={team} />
			<this.Classes team={team} />
			<td><Spinner value={team.members} onChange={m => this.setMembers(team, m)} /></td>
			<td><Spinner value={team.alternates} onChange={a => this.setAlternates(team, a)} /></td>
			<td><TextInput name="Startavgift" className="fee" id="fee" placeholder="Avgift" mask="1234567890" maxLength="5" value={team.cost || 0} onChange={c => this.setCost(team, parseInt(c.target.value, 10))}/></td>
			<td><button className="small red button-close" onClick={e => this.deleteTeam(team)} /></td>
		</tr>;
	}

	DivHeader = () => {
		let { divisions } = this.state.event;
		if (divisions === undefined) { return null; }
		let divGrp = this.DivisionGroups.find(dg => dg.id === divisions);
		return <th>{divGrp.header || "Vapengrupp"}</th>;
	}

	ClsHeader = () => {
		let { classes } = this.state.event;
		if (classes === undefined) { return null; }
		let clsGrp = this.ClassGroups.find(cg => cg.id === classes);
		return <th>{clsGrp.header || "Klass"}</th>
	}

	Header = () => {
		return <thead>
			<tr>
				<this.DivHeader />
				<this.ClsHeader />
				<th>Deltagare</th>
				<th>Reserver</th>
				<th>Avgift</th>
				<th>Radera</th>
			</tr>
		</thead>;
	}

	render() {
		if (this.state.event === undefined) { return null; }
		return <ModalDialog title="Lag" onClose={this.onClose} showClose="true">
			<table id="team-definitions" className="table-light">
				<this.Header />
				<tbody>
					{this.state.event.teams.map((t, i) => <this.TeamRow key={i} team={t} />)}
				</tbody>
			</table>
			<div className="modal-buttons">
				<div><button className="button button-add green" onClick={this.addTeam} />Lägg till lag</div>
				<div className="spacer"></div>
				<button className="button" onClick={this.onClose}>OK</button>
			</div>
		</ModalDialog>;
	}
}