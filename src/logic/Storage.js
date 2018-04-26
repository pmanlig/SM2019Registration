import { InjectedClass } from '.';

export class Storage extends InjectedClass {
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
}