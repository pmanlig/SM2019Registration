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
		if (!this.CompetitionGroups) { return null; }
		return <div className="group-list-items">
			{this.CompetitionGroups.groups.map(g => <div key={g.id} className={"item select" + (g === this.selected ? " selected" : "")} onClick={e => this.selectGroup(g)}>
				<p>{g.name}</p>
				<button className="button-close small red" onClick={e => { this.deleteGroup(g); }} />
			</div>)}
			<div className="add item" onClick={this.newGroup}>
				<button className="button-add small" />
				<p className="add">Skapa ny grupp</p>
			</div>
		</div>
	}

	GroupControls = () => {
		if (!this.selected) { return null; }
		return <div className="group-controls">
			<button className="button-collapse" onClick={() => {
				this.CompetitionGroups.moveUp(this.selected.index);
				this.setState({dirty: true});
			}} />
			<button className="button-expand" onClick={() => {
				this.CompetitionGroups.moveDown(this.selected.index);
				this.setState({dirty: true});
			}} />
		</div>;
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
			<h3>Grupper</h3>
			<div className="group-layout">
				<this.GroupList />
				<GroupProperties icons={this.CompetitionGroups.icons} selected={this.selected} onChange={this.changeGroup} />
				<this.GroupControls />
			</div>
			<button className={"button" + (this.state.dirty ? "" : " disabled")} onClick={this.save}>Spara</button>
		</div>;
	}
}