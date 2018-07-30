import React from 'react';
import { InjectedComponent, Components } from '../logic';

export class DivisionPicker extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {};
		this.loadGroups();
	}

	loadGroups() {
		this.inject(Components.Server).loadDivisionGroups(json => this.setState({ divisionGroups: json }));
	}

	render() {
		return <div>
			<div className="drop-clickcatcher" onClick={this.props.onClose} />
			<div className="sidebar">
				<h1>Välj&nbsp;vapengrupper</h1>
				<div className="pick" onClick={e => this.props.action(undefined)}>Inget val av vapengrupp</div>
				{this.state.divisionGroups && this.state.divisionGroups.map(dg => <div key={dg.id} className="pick" onClick={e => this.props.action(dg)}>{dg.description}</div>)}
			</div>
		</div>;
	}
}