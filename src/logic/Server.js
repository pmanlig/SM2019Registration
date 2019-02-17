export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService", "RegistrationService"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	//#region Main fetch/send method
	load(url, callback) {
		if (window._debug) { console.log(`URL: ${url}`); }
		this.Busy.setBusy(this, true);
		fetch(url)
			.then(result => result.json())
			.then(json => {
				callback(json);
				this.Busy.setBusy(this, false);
			})
			.catch(e => {
				console.log(e);
				this.Busy.setBusy(this, false);
			});
		// finally() not supported in several browsers :(
		// .finally(() => this.Busy.setBusy(Server.id, false));
	}

	send(url, data, callback, error) {
		if (window._debug) {
			console.log(`URL: ${url}`);
			if (error === undefined) { error = e => { console.log("Error"); console.log(e); } }
		}
		this.Busy.setBusy(this, true);
		return fetch(url, {
			crossDomain: true,
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(res => {
				this.Busy.setBusy(this, false);
				if (!res.ok) {
					res.json().then(error);
					return;
				}
				res.json()
					.then(callback)
					.catch(error);
			});
	}
	//#endregion

	//#region Remote Services
	jsonFile(name) {
		return `${process.env.PUBLIC_URL}/${name}.json`;
	}

	remoteCompetitionService() {
		return {
			loadCompetitionList: (callback) => { this.load(`${Server.baseUrl}/competition`, callback); },
			loadCompetition: (id, callback) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(id) : `${Server.baseUrl}/competition/${id}`, callback); },
			createCompetition: (competition, callback) => { console.log("Create competition - Not implemented"); },
			updateCompetition: (competition, callback) => { console.log("Update competition - Not implemented"); },
			deleteCompetition: (id, callback) => { console.log("Delete competition - Not implemented"); }
		};
	}

	remoteResultService() {
		return {
			loadResults: (c, e, callback) => { this.load(isNaN(parseInt(c, 10)) ? this.jsonFile(`${c}_result`) : `${Server.baseUrl}/result/${c}/${e}`, callback); }
		};
	}

	remoteScheduleService() {
		return {};
	}

	remoteRegistrationService() {
		return {
			loadRegistration: (id, token, callback) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(`${id}_token`) : `${Server.baseUrl}/competition/${id}/${token}`, callback); },
			sendRegistration: (data, callback, error) => { this.send(`${Server.baseUrl}/register`, data, callback, error) }
		}
	}
	//#endregion

	//#region Property manipulation
	initialize() {
		// ToDo: Change to false in production code
		this.setLocal(this.Storage.get(this.Storage.keys.serverMode));
	}

	setLocal(on) {
		this.local = on;
		if (this.local) {
			this.competitionService = this.CompetitionService;
			this.scheduleService = this.ScheduleService;
			this.resultService = this.ResultService;
			this.registrationService = this.RegistrationService;
		} else {
			this.competitionService = this.remoteCompetitionService();
			this.scheduleService = this.remoteScheduleService();
			this.resultService = this.remoteResultService();
			this.registrationService = this.remoteRegistrationService();
		}
		this.Storage.set(this.Storage.keys.serverMode, this.local);
		this.fire(this.Events.serverChanged);
	}
	//#endregion

	//#region Logging
	logFetchCallback(msg, c) {
		if (!window._debug) { return c; }
		return json => {
			console.log(msg);
			console.log(json);
			c(json);
		}
	}

	logSendCallback(msg, data, c) {
		if (!window._debug) { return c; }
		console.log(msg);
		console.log(data);
		return json => {
			console.log("Reply:");
			console.log(json);
			c(json);
		}
	}
	//#endregion

	//#region Competition
	loadCompetitionList(callback) { this.competitionService.loadCompetitionList(this.logFetchCallback("Loading competition list", callback)); }
	loadCompetition(competitionId, callback) { this.competitionService.loadCompetition(competitionId, this.logFetchCallback("Loading competition data", callback)); }
	createCompetition(competition, callback) { this.competitionService.createCompetition(competition, this.logSendCallback("Creating new competition", competition, callback)); }
	updateCompetition(competition, callback) { this.competitionService.updateCompetition(competition, this.logSendCallback("Updating competition", competition, callback)); }
	deleteCompetition(competitionId, callback) { this.competitionService.deleteCompetition(competitionId, this.logSendCallback("Deleting competition", competitionId, callback)); }
	//#endregion

	//#region Results
	loadResults(competitionId, eventId, callback) { this.resultService.loadResults(competitionId, eventId, this.logFetchCallback(`Loading competition results for ${competitionId}/${eventId}`, callback)); }
	//#endregion

	//#region Registration
	loadRegistration(competitionId, token, callback) { this.registrationService.loadRegistration(competitionId, token, this.logFetchCallback(`Loading registration data for ${competitionId}/${token}`, callback)); }
	sendRegistration(data, callback, error) { this.registrationService.sendRegistration(data, this.logSendCallback(`Sending registration`, data, callback), error); }
	//#endregion

	//#region Schedule
	createSchedule(callback) {
		// ToDo: connect to real service instead
		this.ScheduleService.createNewSchedule(this.logFetchCallback("Creating schedule", callback));
	}

	loadSchedule(scheduleId, callback) {
		// ToDo: connect to real service instead
		this.ScheduleService.getSchedule(scheduleId, this.logFetchCallback("Loading schedule", callback));
		/*
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ?
			this.jsonFile(`${competitionId}_schedule`) :
			`${Server.baseUrl}/schedule/${scheduleId}`, callback);
			*/
	}

	updateSchedule(schedule) {
		// ToDo: connect to real service instead
		this.ScheduleService.updateSchedule(schedule);
	}
	//#endregion

	//#region Value lists
	loadClassGroups(callback) {
		this.load(this.jsonFile("classes"), callback);
	}

	loadDivisionGroups(callback) {
		this.load(this.jsonFile("divisions"), callback);
	}
	//#endregion

	//#region Login
	login(user, password, callback) {
		if (this.local) {
			callback({});
		} else {
			this.send(`${Server.baseUrl}/login`, { user: user, password: password }, this.logSendCallback("Login", user, callback));
		}
	}

	logout(callback) {
		if (this.local) {
			callback({});
		} else {
			this.load(`${Server.baseUrl}/logout`, this.logFetchCallback("Logout", callback));
		}
	}
	//#endregion
}