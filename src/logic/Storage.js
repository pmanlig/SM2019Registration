export class StorageKeys {
	static allowStorage = "allowStorage";
	static lastContact = "lastContact";
	static registry = "registry";
	static Registry = "Registry";
	static newCompetition = "newCompetition";
	static tokens = "tokens";
	static results = "results";
	static schedules = "schedules";
}

export class Storage {
	static register = { name: "Storage", createInstance: true }

	keys = {};

	registerKey(key) {
		this.keys[key] = true;;
	}

	set(key, value) {
		// if (!this.keys[key]) { throw new Error("The key has not been registered! (" + key + ")"); }
		window.localStorage[key] = JSON.stringify(value);
	}

	get(key) {
		// if (!this.keys[key]) { throw new Error("The key has not been registered! (" + key + ")"); }
		try {
			return JSON.parse(window.localStorage[key]);
		} catch (error) {
			return undefined;
		}
	}

	delete() {
		if (window._debug) {
			console.log("Deleting storage");
			console.log(this.keys);
		}
		for (var k in this.keys) {
			window.localStorage.removeItem(k);
		}
	}
}