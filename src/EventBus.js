import Rx from 'rxjs';

export class EventBus {
	static footersChanged = 1;
	static changeTitle = 2;
	static busyChanged = 3;
	static addParticipant = 4;

	constructor() {
		this.bus = new Rx.Subject();
	}

	subscribe(event, action) {
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