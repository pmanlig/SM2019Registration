import { InjectedClass } from '.';

export class Storage extends InjectedClass {
	keys = [];

	registerKey(key) {
		this.keys.push(key);
	}
	
	set(key, value) {
		window.localStorage[key] = JSON.stringify(value);
	}

	get(key) {
		try {
			return JSON.parse(window.localStorage[key]);
		} catch (error) {
			return undefined;
		}
	}

	delete() {
		this.keys.forEach(k => window.localStorage.removeItem(k));
	}
}