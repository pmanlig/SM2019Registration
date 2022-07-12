import React from 'react';
import { TabInfo } from '../models';

export class GroupAdminView extends React.Component {
	static register = { name: "GroupAdminView" };
	static wire = ["Server"];
	static adminTab = new TabInfo("Grupper", "groups", 2);

	render() {
		return <div className="content">
			<h3>Grupper</h3>
		</div>;
	}
}