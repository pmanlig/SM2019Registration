import React from 'react';

export class CompetitionAdmin extends React.Component {
	static register = { name: "CompetitionAdmin" };
	static wire = ["fire", "Events", "EventBus", "Server", "CompetitionProperties", "Competition"];

	constructor(props) {
		super(props);
		this.state = { dirty: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.setState({ dirty: true });
			this.fire(this.Events.changeTitle, `Administrera ${this.Competition.name}`)
		});
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Administrera ${this.Competition.name}`);
	}

	saveCompetition = () => {
		this.Server.updateCompetition(this.Competition.id, this.Competition.toJson(), success => this.setState({ dirty: !success }));
	}

	render() {
		return <div className="content">
			<button className={this.state.dirty ? "button" : "button disabled"} onClick={this.saveCompetition}>Spara</button>
			<this.CompetitionProperties />
		</div>;
	}
}