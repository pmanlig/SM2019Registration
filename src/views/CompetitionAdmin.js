import React from 'react';

export class CompetitionAdmin extends React.Component {
	static register = { name: "CompetitionAdmin" };
	static wire = ["fire", "Events", "EventBus", "Server", "CompetitionProperties", "Competition", "Footers"];

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