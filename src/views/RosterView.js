import React from 'react';

export class RosterView extends React.Component {
	static register = { name: "RosterView" };
	static wire = ["Competition"];

	constructor(props) {
		super(props);
		this.state = {};
		this.loadSchedules();
	}

	loadSchedules = () => {
		let schedulesToLoad = this.Competition.events.map(e => e.schedule).filter(s => s !== undefined);
		console.log(schedulesToLoad);
	}

	render() {
		return <div className="content">
			<h2>Startlista</h2>
		</div>
	}
}