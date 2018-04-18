import Rx from 'rxjs';

export class EventBus {
	static eventId = 1;
	static footersChanged = EventBus.eventId++;
	static changeTitle = EventBus.eventId++;
	static busyChanged = EventBus.eventId++;
	static addParticipant = EventBus.eventId++;
	static deleteParticipant = EventBus.eventId++;
	static register = EventBus.eventId++;

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