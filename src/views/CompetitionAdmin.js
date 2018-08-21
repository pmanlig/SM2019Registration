import React from 'react';

export class CompetitionAdmin extends React.Component {
	static register = { name: "CompetitionAdmin" };
	static wire = ["fire", "Events", "CompetitionProperties", "Competition"];

	componentDidMount() {
		this.fire(this.Events.changeTitle, `Administrera ${this.Competition.name}`);
	}

	render() {
		return <div className="content">
			<this.CompetitionProperties />
		</div>;
	}
}