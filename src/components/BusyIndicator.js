import React, { Component } from 'react';
import { EventBus } from '../EventBus';

export class Busy {
	constructor(injector) {
		this.eventBus = injector.inject("EventBus");
		this.busy = [];
	}

	setBusy(id, busy) {
		if (busy) {
			this.busy.push(id);
		} else {
			this.busy = this.busy.filter(e => e !== id);
		}
		this.eventBus.fire(EventBus.busyChanged);
	}
}

export class BusyIndicator extends Component {
	componentDidMount() {
		this.subscription = this.props.injector.inject("EventBus").subscribe(EventBus.busyChanged, () => this.setState({}));
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return this.props.injector.inject("Busy").busy.length > 0 && <div className="fullscreen shadow"><p className="centered">Working...</p></div >;
	}
}