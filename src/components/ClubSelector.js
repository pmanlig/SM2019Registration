import React from 'react';

export class ClubSelector extends React.Component {
	static register = { name: "ClubSelector" };
	static wire = ["subscribe", "Events", "EventBus", "Clubs"];

	constructor(props) {
		super(props);
		this.state = { data: this.Clubs.data }
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.clubsLoaded, () => this.setState({ data: this.Clubs.data }));
	}

	render() {
		return <span>
			<input {...this.props} list="clubs" />
			<datalist id="clubs">
				{this.state.data.map(s => <option key={s} value={s} />)}
			</datalist>
		</span>;
	}
}