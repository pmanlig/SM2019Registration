import React from 'react';
import { TabInfo } from '../../models';
import { Events } from '../../logic';

export class GroupAdminTab extends React.Component {
	static register = { name: "GroupAdminView" };
	static wire = ["EventBus", "Server", "CompetitionGroups"];
	static adminTab = new TabInfo("Grupper", "groups", 2);

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(Events.competitionGroupsUpdated, () => this.setState({}));
	}

	render() {
		console.log("GroupAdmin", this.CompetitionGroups);
		return <div className="content">
			<h3>Grupper</h3>
			<div id="admin-view">
				<div>
					{this.CompetitionGroups.groups.map(g => <div key={g.id} className="item select">
						<p>{g.name}</p>
						<button className="button-close small red" onClick={e => { }} />
					</div>)}
					<div className="add item" onClick={this.addClassGroup}>
						<button className="button-add small" />
						<p className="add">Skapa ny grupp</p>
					</div>
				</div>
			</div>
		</div>;
	}
}