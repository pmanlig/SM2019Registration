import React from 'react';
import { InjectedComponent, Components } from '../logic';

export class ClassPicker extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {};
		this.loadGroups();
	}

	loadGroups() {
		this.inject(Components.Server).loadClassGroups(json => this.setState({ classGroups: json }));
	}

	render() {
		return <div className="sidebar">
			<h1>Välj&nbsp;klassindelning</h1>
			<div className="pick" onClick={e => this.props.action(undefined)}>Ingen klassindelning</div>
			{this.state.classGroups && this.state.classGroups.map(cg => <div key={cg.id} className="pick" onClick={e => this.props.action(cg)}>{cg.description}</div>)}
		</div>;
	}
}