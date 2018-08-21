import React from 'react';

export class CompetitionAdmin extends React.Component {
	static register = { name: "CompetitionAdmin" };
	static wire = ["fire", "subscribe", "Events", "EventBus", "Server", "CompetitionProperties", "Competition"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);

		// ToDo: Store competition
		/*
		this.subscribe(this.Events.competitionUpdated, () =>
			this.Server.storeCompetition(this.Competition.toJson()));
			*/
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Administrera ${this.Competition.name}`);
	}

	render() {
		return <div className="content">
			<this.CompetitionProperties />
		</div>;
	}
}