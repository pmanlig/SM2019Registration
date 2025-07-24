import './GroupAdmin.css';
import React from 'react';
import { TabInfo } from '../../models';
import { Events } from '../../logic';
import { GroupProperties } from '../../components';

export class GroupAdminTab extends React.Component {
	static register = { name: "GroupAdminView" };
	static wire = ["EventBus", "Server", "CompetitionGroups"];
	static adminTab = new TabInfo("Grupper", "groups", 2);

	constructor(props) {
		super(props);
		this.state = { dirty: false };
		this.selected = undefined;
		this.EventBus.manageEvents(this);
		this.subscribe(Events.competitionGroupsUpdated, () => {
			if (this.selected) {
				this.selected = this.CompetitionGroups.groups.find(g => g.id === this.selected.id);
			}
			this.setState({});
		});
	}

	GroupList = () => {
		let selected = this.selected;
		return <div>
			<h3>Grupper</h3>
			{this.CompetitionGroups.groups.map(g => <div key={g.id} className={"item select" + (g === selected ? " selected" : "")} onClick={e => this.selectGroup(g)}>
				<p>{g.name}</p>
				<button className="button-close small red" onClick={e => { this.deleteGroup(g); }} />
			</div>)}
			<div className="add item" onClick={this.newGroup}>
				<button className="button-add small" />
				<p className="add">Skapa ny grupp</p>
			</div>
		</div>
	}

	selectGroup(group) {
		this.selected = group;
		this.setState({});
	}

	changeGroup = (group, prop, value) => {
		this.CompetitionGroups.updateGroup(group, prop, value);
		this.setState({ dirty: true });
	}

	save = () => {
		this.CompetitionGroups.save();
		this.setState({ dirty: false });
	}

	deleteGroup = (g) => {
		this.selected = undefined;
		this.CompetitionGroups.deleteGroup(g);
	}

	newGroup = () => {
		this.selected = this.CompetitionGroups.newGroup();
	}

	render() {
		return <div id="group-admin" className="content">
			<this.GroupList />
			<GroupProperties groups={this.CompetitionGroups} selected={this.selected} onChange={this.changeGroup} />
			<button className={"button" + (this.state.dirty ? "" : " disabled")} onClick={this.save}>Spara</button>
		</div>;
	}
}