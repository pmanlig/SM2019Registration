import './GroupAdmin.css';
import React from 'react';
import { TabInfo } from '../../models';
import { Events } from '../../logic';
import { GroupProperties } from '../../components';

function GroupList({ groups, selected, onSelect }) {
	return <div>
		<h3>Grupper</h3>
		{groups.map(g => <div key={g.id} className={"item select" + (g === selected ? " selected" : "")} onClick={e => onSelect(g)}>
			<p>{g.name}</p>
			<button className="button-close small red" onClick={e => { }} />
		</div>)}
		<div className="add item" onClick={e => { }}>
			<button className="button-add small" />
			<p className="add">Skapa ny grupp</p>
		</div>
	</div>
}

export class GroupAdminTab extends React.Component {
	static register = { name: "GroupAdminView" };
	static wire = ["EventBus", "Server", "CompetitionGroups"];
	static adminTab = new TabInfo("Grupper", "groups", 2);

	constructor(props) {
		super(props);
		this.state = { dirty: false };
		this.EventBus.manageEvents(this);
		this.subscribe(Events.competitionGroupsUpdated, () => this.setState({}));
	}

	changeGroup = (group, prop, value) => {
		this.CompetitionGroups.updateGroup(group,prop,value);
		this.setState({ dirty: true });
	}

	save = () => {
		this.CompetitionGroups.save();
		this.setState({ dirty: false });
	}

	render() {
		return <div id="group-admin" className="content">
			<GroupList groups={this.CompetitionGroups.groups} selected={this.state.selected}
				onSelect={g => this.setState({ selected: g })} />
			<GroupProperties groups={this.CompetitionGroups} selected={this.state.selected} onChange={this.changeGroup} />
			<button className={"button" + (this.state.dirty ? "" : " disabled")} onClick={this.save}>Spara</button>
		</div>;
	}
}