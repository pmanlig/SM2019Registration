import Rx from 'rxjs';

export class EventBus {
	static footersChanged = 1;
	static titleChanged = 2;

	constructor() {
		this.bus = new Rx.Subject();
	}

	subscribe(event, action) {
		// ToDo: add error handling?
		this.bus.subscribe(({ ev, params }) => {
			if (ev === event) {
				action.apply(null, params);
			}
		}, undefined, undefined);
	}

	fire(event, ...params) {
		this.bus.next({ ev: event, params });
	}
}