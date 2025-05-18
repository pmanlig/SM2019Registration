import './ReportIndicator.css';
import React, { useState } from 'react';
import { ModalDialog } from '../general';

export class ReportIndicator extends React.Component {
	static register = { name: "ReportIndicator" };
	static wire = ["EventBus", "Events", "Results"];

	constructor(props) {
		super(props);
		this.state = { showDialog: false };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
	}

	QueueDialog = ({ action }) => {
		if (!this.state.showDialog) return null;
		return <ModalDialog title={"Resultat i kö"} className="yes-no-dialog">
			<p>Det finns resultat som ligger i kö eftersom de inte kunde skickas till servern. Vad vill du göra?</p>
			<button className="button small green" onClick={e => action(e, "resend")}>&#10227; Skicka igen</button>
			<button className="button small red" onClick={e => action(e, "clear")}>× Ta bort</button>
		</ModalDialog>;
	}

	actOnQueue = (event, action) => {
		event.stopPropagation();
		this.setState({ showDialog: false });
		console.log(action);
		if (action === "resend") { this.Results.trySendResults(); }
		if (action === "clear") { this.Results.clearQueue(); }
	}

	render() {
		return this.Results.queue.length === 0 ?
			<div className="report-indicator button green">Inget i kö</div> :
			<div className="report-indicator button red" onClick={e => this.setState({ showDialog: true })}>
				<this.QueueDialog action={this.actOnQueue} />
				{/*×*/}{this.Results.queue.length} resultat i kö
			</div>;
	}
}