import './ReportIndicator.css';
import React from 'react';

export class ReportIndicator extends React.Component {
	static register = { name: "ReportIndicator" };
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
			<div className="report-indicator button green">Inget i kö</div> :
			<div className="report-indicator button red" onClick={this.clearQueue}>
				× {this.Results.queue.length} resultat i kö
			</div>;
	}
}