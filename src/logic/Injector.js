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
			if (c.register.name === undefined) { console.log(`WARNING: name not set on class ${c.name}`) }
			let name = c.register.name || c.name;
			if (c.register.createInstance) {
				if (_INJECTOR_LOGLEVEL === "details") {
					console.log(`Registering resource ${name}`);
				}
				this[name] = new c();
				return;
			}
			if (_INJECTOR_LOGLEVEL === "details") {
				console.log(`Registering component/method ${name}`);
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
						console.log(`Injecting ${i} into ${c.name}` + ((c.register && c.register.name) ? ` (${c.register.name})` : ""));
					}
					c.prototype[i] = this[i];
				} else {
					console.log(`ERROR: Cannot inject entity ${i} into ${c.name}`);
				}
			});
			if (c.register && c.register.createInstance) {
				if (_INJECTOR_LOGLEVEL === "details") {
					console.log(`Creating instance for class ${c.name}`);
				}
				let i = this[c.register.name || c.name];
				if (i.initialize && (typeof i.initialize === "function")) {
					i.initialize();
				}
			}
		});
	}
}