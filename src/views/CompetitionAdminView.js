import React from 'react';
import { Permissions, TabInfo } from '../models';

export class CompetitionAdminView extends React.Component {
	static register = { name: "CompetitionAdminView" };
	static wire = ["fire", "Events", "EventBus", "Server", "CompetitionProperties", "Competition", "Footers"];
	static tabInfo = new TabInfo("Inställningar", "admin", 204, Permissions.Own);

	constructor(props) {
		super(props);
		this.state = {};
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.setState({});
			this.fire(this.Events.changeTitle, `Inställningar för ${this.Competition.name}`);
		});
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Inställningar för ${this.Competition.name}`);
	}

	render() {
		return <div className="content">
			<button className={this.Competition.dirty ? "button" : "button disabled"} onClick={() => this.Competition.saveCompetition()}>Spara</button>
			<this.CompetitionProperties />
		</div>;
	}
}