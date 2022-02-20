import './ResultIndicator.css';
import React from 'react';

export class ResultIndicator extends React.Component {
	static register = { name: "ResultIndicator" };
	static wire = ["EventBus", "Events", "Results"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
	}

	clearQueue = () => {
		this.Results.clearQueue();
	}

	render() {
		return this.Results.queue.length === 0 ?
			<div className="result-indicator button green">Inget i kö</div> :
			<div className="result-indicator button red" onClick={this.clearQueue}>
				× {this.Results.queue.length} resultat i kö
			</div>;
	}
}