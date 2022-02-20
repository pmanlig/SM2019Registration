import React from 'react';

export class Busy {
	static register = { name: "Busy", createInstance: true }
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

	wrap(x, ...args) {
		this.setBusy(x, true)
		x(...args.map(p => typeof p === "function" ? (...a) => {
			p(...a);
			this.setBusy(x, false);
		}: p));
	}
}

// ToDo: apply withEvents
export class BusyIndicator extends React.Component {
	static register = { name: "BusyIndicator" };
	static wire = ["Busy", "Events", "EventBus"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.busyChanged, () => this.setState({}));
	}

	render() {
		return this.Busy.busy.length > 0 && <div><div className="fullscreen shadow" /><p className="centered">Working...</p></div >;
	}
}