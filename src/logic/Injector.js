import React from 'react';
import { AsyncSubject } from 'rxjs';

export class InjectedComponent extends React.Component {
	handlers = [];

	constructor(props) {
		super(props);
		this.inject = props.inject;
		this.subscribe = (e, h) => {
			this.handlers.push({
				event: e,
				handler: h,
				subscription: null
			});
		}
		this.fire = props.fire;
	}

	componentDidMount() {
		this.handlers.forEach(h => {
			h.subscription = this.props.subscribe(h.event, h.handler);
		});
	}

	componentWillUnmount() {
		this.handlers.forEach(h => {
			h.subscription.unsubscribe();
			h.subscription = null;
		});
	}
}

export class InjectedClass {
	constructor(injector) {
		this.injector = injector;
		this.inject = injector.inject.bind(injector);
		this.subscribe = injector.subscribe.bind(injector);
		this.fire = injector.fire.bind(injector);
	}
}

export class Injector {
	entities = {};
	resources = {};

	resource(key) { 
		if (this.resources[key] === undefined){
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
		this.register(id, props =>
			<Component
				injector={this}
				inject={this.inject.bind(this)}
				subscribe={this.subscribe.bind(this)}
				fire={this.fire.bind(this)}
				{...props} />);
	}

	unregister(key) {
		// ToDo: remove
	}

	inject(key) {
		return this.entities[key];
	}

	loadResource(key, handler) {
		this.resource(key).subscribe(handler);
	}
}