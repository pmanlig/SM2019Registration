import React from 'react';
import { Events } from '.';

export class Busy {
	static register = { createInstance: true }
	static inject = ["fire"];

	busy = [];

	setBusy(id, busy) {
		if (busy) {
			this.busy.push(id);
		} else {
			this.busy = this.busy.filter(e => e !== id);
		}
		this.fire(Events.busyChanged);
	}
}

// ToDo: apply withEvents
export class BusyIndicator extends React.Component {
	static register = true;
	static inject = ["Busy", "subscribe"];

	constructor(props) {
		super(props);
		this.subscribe(Events.busyChanged, () => this.setState({}));
	}

	render() {
		return this.Busy.busy.length > 0 && <div className="fullscreen shadow"><p className="centered">Working...</p></div >;
	}
}