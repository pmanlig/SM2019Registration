import React, { Component } from 'react';
import { AsyncSubject } from 'rxjs';
import { EventBus } from '.';

export function withEvents(BaseComponent) {
	return class extends Component {
		handlers = [];

		subscribe = (e, h) => {
			this.handlers.push({
				event: e,
				handler: h,
				subscription: null
			});
		}

		componentDidMount() {
			this.handlers.forEach(h => {
				h.subscription = this.props.subscribe(h.event, h.handler);
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
			return <BaseComponent
				{...this.props}
				subscribe={this.subscribe} />;
		}
	}
}

export class InjectedComponent extends Component {
	constructor(props) {
		super(props);
		this.inject = props.inject;
		this.subscribe = props.subscribe;
		this.fire = props.fire;
	}
}

export class InjectedClass {
	constructor(injector) {
		this.injector = injector;
		this.inject = injector.inject;
		this.subscribe = injector.subscribe;
		this.fire = injector.fire;
	}
}

export class Injector {
	entities = {};
	resources = {};

	constructor() {
		let ev = new EventBus();
		this.subscribe = ev.subscribe.bind(ev);
		this.fire = ev.fire.bind(ev);
	}

	resource(key) {
		if (this.resources[key] === undefined) {
			this.resources[key] = new AsyncSubject();
		}
		return this.resources[key];
	}

	register(key, entity) {
		this.entities[key] = entity;
	}

	registerResource(key, resource) {
		let resourceAsync = this.resource(key);
		resourceAsync.next(resource);
		resourceAsync.complete();
	}

	registerComponent(id, Component) {
		let ComponentWithEvents = withEvents(Component);
		this.register(id, props =>
			<ComponentWithEvents
				{...props}
				injector={this}
				inject={this.inject}
				subscribe={this.subscribe}
				fire={this.fire}
			/>);
	}

	unregister = (key) => {
		// ToDo: implement
	}

	inject = (key) => {
		return this.entities[key];
	}

	loadResource = (key, handler) => {
		this.resource(key).subscribe(handler);
	}
}