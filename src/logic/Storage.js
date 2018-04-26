import { InjectedClass } from '.';

export class Storage extends InjectedClass {
	static Registry = "registry";
	static Contact = "contact";
	static Tokens = "tokens";

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
		window.localStorage.removeItem(Storage.Registry);
		window.localStorage.removeItem(Storage.Contact);
		window.localStorage.removeItem(Storage.Tokens);
	}
}