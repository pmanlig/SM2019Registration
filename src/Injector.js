export class Injector {
	entities = {};
	state = {};

	register(key, entity) {
		this.entities[key] = entity;
	}

	inject(key) {
		return this.entities[key];
	}
}