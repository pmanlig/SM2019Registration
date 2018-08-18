export class Storage {
	static register = { name: "Storage", createInstance: true }

	keys = {
		allowStorage: "allowStorage",
		lastContact: "lastContact",
		registry: "registry",
		newCompetition: "newCompetition",
		tokens: "tokens",
		results: "results",
		schedules: "schedules",
		competitions: "competitions"
	};

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