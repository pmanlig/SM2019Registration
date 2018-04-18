export default class Injector {
	entities = {};

	register(key, entity) {
		this.entities[key] = entity;
	}

	unregister(key) {
		// ToDo: remove
	}

	inject(key) {
		return this.entities[key];
	}
}