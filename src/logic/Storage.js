export class Storage {
	static register = { name: "Storage", createInstance: true }

	keys = {
		allowStorage: "allowStorage",
		lastContact: "lastContact",
		registry: "registry",
		newCompetition: "newCompetition",
		tokens: "tokens",
		localTokens: "localTokens",
		results: "results",
		serverMode: "serverMode",
		toggleServerMode: "toggleServer",
		scheduleService: "scheduleService",
		competitionService: "competitionService",
		resultService: "resultService",
		registrationService: "registrationService",
		registrationContact: "Contact"
	};

	set(key, value) {
		// if (!this.keys[key]) { throw new Error("The key has not been registered! (" + key + ")"); }
		if (key === this.keys.allowStorage && value) this.allowStorage = true;
		if (this.allowStorage) window.localStorage[key] = JSON.stringify(value);
	}

	get(key) {
		// if (!this.keys[key]) { throw new Error("The key has not been registered! (" + key + ")"); }
		try {
			if (key === this.keys.allowStorage) this.allowStorage = JSON.parse(window.localStorage[key]);
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