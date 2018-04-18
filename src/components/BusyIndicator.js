import React from 'react';
import { InjectedComponent, Components, Events } from '.';

export class Busy {
	constructor(injector) {
		this.fire = injector.fire;
		this.busy = [];
	}

	setBusy(id, busy) {
		if (busy) {
			this.busy.push(id);
		} else {
			this.busy = this.busy.filter(e => e !== id);
		}
		this.fire(Events.busyChanged);
	}
}

export class BusyIndicator extends InjectedComponent {
	componentDidMount() {
		this.subscription = this.props.subscribe(Events.busyChanged, () => this.setState({}));
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return this.inject(Components.Busy).busy.length > 0 && <div className="fullscreen shadow"><p className="centered">Working...</p></div >;
	}
}