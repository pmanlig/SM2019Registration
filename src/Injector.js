export class Injector {
	entities = {};

	register(key, entity) {
		this.entities[key] = entity;
	}

	inject(key) {
		return this.entities[key];
	}
}