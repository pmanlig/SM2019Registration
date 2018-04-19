import Rx from 'rxjs';

export class EventBus {
	constructor() {
		this.bus = new Rx.Subject();
	}

	subscribe(event, action) {
		if (event === undefined) {
			throw new Error("Cannot subscribe to undefined event!");
		}

		// ToDo: add error handling?
		return this.bus.subscribe(({ ev, params }) => {
			if (ev === event) {
				action.apply(null, params);
			}
		}, undefined, undefined);
	}

	fire(event, ...params) {
		this.bus.next({ ev: event, params });
	}
}