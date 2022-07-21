import "./Tabs.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as Admin from '.';

function adminTabs() {
	let tabs = [];
	for (const t in Admin) {
		if (typeof Admin[t] === "function" && Admin[t].adminTab) {
			tabs.push(Admin[t]);
		}
	}
	return tabs;
}

export class AdminView extends React.Component {
	static register = { name: "AdminView" };
	static wire = ["fire", "Events", "ClassGroups", "DivisionGroups", "YesNoDialog"];

	render() {
		let { operation } = this.props.match.params;
		let tabs = adminTabs();
		if (operation === undefined) { return <Redirect to={`/admin/${tabs[0].adminTab.path}`} /> }
		const Content = tabs.find(t => t.adminTab.path === operation);
		if (Content === undefined) { return null; }
		return <div>
			{tabs.length > 0 && <div className="tabs">
				{tabs.map(t => t.adminTab).map(t => operation === t.path ?
					<p key={t.path} className="tab">{t.name}</p> :
					<Link key={t.path} className="tab" to={`/admin/${t.path}`} >{t.name}</Link>)}
			</div>}
			<Content />
		</div>;
	}
}