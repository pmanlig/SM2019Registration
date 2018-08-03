import React from 'react';
import { AsyncSubject } from 'rxjs';
import { EventBus, withEvents } from '.';

export class InjectedComponent extends React.Component {
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
		let entity = props =>
			<ComponentWithEvents
				{...props}
				injector={this}
				inject={this.inject}
				subscribe={this.subscribe}
				fire={this.fire}
			/>;
		this.register(id, entity);
		// ToDo: rewrite to use this syntax
		if (Component.name.search(/^[A-Z]/) !== -1) {
			this[Component.name] = entity;
		}
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

var _INJECTOR_LOGLEVEL = "errors";
// _INJECTOR_LOGLEVEL = "details";

export class AutoInjector {
	injectList = [];

	static wrapComponentRegistration(component) {
		return component.register ? { ...component.register, name: component.register.name || component.name } : component.register;
	}

	registerModule(module) {
		for (let c in module) {
			if (module[c]) {
				this.register(module[c]);
			}
		}
	}

	addToInjectList(c) {
		if (c.wire) {
			this.injectList.push(c);
			c.wire.forEach(i => {
				if (i.wire) {
					this.addToInjectList(i);
				}
			});
		}
	}

	register(c) {
		this.addToInjectList(c);
		if (c.register) {
			let name = c.register.name || c.name;
			if (c.register.createInstance) {
				if (_INJECTOR_LOGLEVEL === "details") {
					console.log("Registering resource " + name);
				}
				this[name] = new c();
				return;
			}
			if (_INJECTOR_LOGLEVEL === "details") {
				console.log("Registering component/method " + name);
			}
			this[name] = c;
		}
	}

	inject() {
		this.injectList.forEach(c => {
			c.wire.forEach(i => {
				if (typeof i !== "string") {
					return;
				}
				if (this[i]) {
					if (_INJECTOR_LOGLEVEL === "details") {
						console.log("Injecting " + i + " into " + c.name + ((c.register && c.register.name) ? " (" + c.register.name + ")" : ""));
					}
					c.prototype[i] = this[i];
				} else {
					console.log("ERROR: Cannot inject entity " + i + " into " + c.name);
				}
			});
			if (c.register && c.register.createInstance) {
				if (_INJECTOR_LOGLEVEL === "details") {
					console.log("Creating instance for class " + c.name);
				}
				let i = this[c.register.name || c.name];
				if (i.initialize && (typeof i.initialize === "function")) {
					i.initialize();
				}
			}
		});
	}
}