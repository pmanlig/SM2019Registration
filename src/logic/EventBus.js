import React from 'react';
import { Subject } from 'rxjs';
import { AutoInjector } from './Injector';

export class Events {
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
}

export class EventBus {
	static register = { createInstance: true }

	constructor() {
		this.bus = new Subject();
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

export function withEvents(BaseComponent) {
	return class withEvents extends React.Component {
		static register = AutoInjector.wrapComponentRegistration(BaseComponent);
		static wire = ["EventBus", BaseComponent];

		handlers = [];

		subscribe(e, h) {
			this.handlers.push({
				event: e,
				handler: h,
				subscription: null
			});
		}

		componentDidMount() {
			this.handlers.forEach(h => {
				h.subscription = this.EventBus.subscribe(h.event, h.handler);
			});
		}

		componentWillUnmount() {
			this.handlers.forEach(h => {
				if (h.subscription !== null) {
					h.subscription.unsubscribe();
					h.subscription = null;
				}
			});
		}

		render() {
			BaseComponent.prototype.subscribe = this.subscribe.bind(this);
			return <BaseComponent	{...this.props} />;
		}
	}
}