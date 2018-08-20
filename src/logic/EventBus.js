import { Subject } from 'rxjs';

export class Events {
	static register = { name: "Events" };
	static eventId = 1;
	static addFooter = Events.eventId++;
	static footersChanged = Events.eventId++;
	static changeTitle = Events.eventId++;
	static busyChanged = Events.eventId++;
	static deleteParticipant = Events.eventId++;
	static showParticipantPicker = Events.eventId++;
	static showSchedule = Events.eventId++;
	static registryUpdated = Events.eventId++;
	static setRegistrationInfo = Events.eventId++;
	static competitionUpdated = Events.eventId++;
	static registrationUpdated = Events.eventId++;
	static resultsUpdated = Events.eventId++;
	static registerForCompetition = Events.eventId++;
	static userChanged = Events.eventId++;
	static serverChanged = Events.eventId++;
}

export class EventBus {
	static register = { name: "EventBus", createInstance: true }

	constructor() {
		this.bus = new Subject();
	}

	manageEvents(target) {
		// Handlers
		target._handlers = [];

		// Subscribe
		let targetSubscribe = function (e, h) {
			this._handlers.push({ event: e, handler: h, subscription: null });
		}
		target.subscribe = targetSubscribe.bind(target);

		// Fire
		target.fire = this.fire.bind(this);

		// ComponentDidMount
		let mySubscribe = this.subscribe.bind(this);
		let inheritedMount = target.componentDidMount;
		let targetMount = function () {
			this._handlers.forEach(h => h.subscription = mySubscribe(h.event, h.handler));
			if (inheritedMount) {
				inheritedMount.apply(target);
			}
		}
		target.componentDidMount = targetMount.bind(target);

		// ComponentWillUnmount
		let inheritedUnmount = target.componentWillUnmount;
		let targetUnmount = function () {
			this._handlers.forEach(h => {
				if (h.subscription) {
					h.subscription.unsubscribe();
					h.subscription = null;
				}
			});
			if (inheritedUnmount) {
				inheritedUnmount.apply(target);
			}
		}
		target.componentWillUnmount = targetUnmount.bind(target);
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