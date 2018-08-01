export class Storage {
	static register = { createInstance: true }

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
		console.log("Deleting storage");
		console.log(this.keys);
		this.keys.forEach(k => window.localStorage.removeItem(k));
	}
}