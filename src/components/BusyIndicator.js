import React from 'react';

export class Busy {
	static register = { createInstance: true }
	static wire = ["fire", "Events"];

	busy = [];

	setBusy(id, busy) {
		if (busy) {
			this.busy.push(id);
		} else {
			this.busy = this.busy.filter(e => e !== id);
		}
		this.fire(this.Events.busyChanged);
	}
}

// ToDo: apply withEvents
export class BusyIndicator extends React.Component {
	static register = true;
	static wire = ["Busy", "subscribe", "Events"];

	constructor(props) {
		super(props);
		this.subscribe(this.Events.busyChanged, () => this.setState({}));
	}

	render() {
		return this.Busy.busy.length > 0 && <div className="fullscreen shadow"><p className="centered">Working...</p></div >;
	}
}