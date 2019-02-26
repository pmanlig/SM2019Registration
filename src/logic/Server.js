export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService", "RegistrationService", "Footers"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	//#region Main fetch/send method
	load(url, callback, error) {
		if (window._debug) { console.log(`URL: ${url}`); }
		error = error || (e => console.log(e));
		this.Busy.setBusy(this, true);
		fetch(url, {
			crossDomain: true,
			credentials: 'include',
		})
			.then(result => result.json())
			.then(json => {
				callback(json);
				this.Busy.setBusy(this, false);
			})
			.catch(e => {
				error(e);
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
			credentials: 'include',
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

	update(url, data, callback, error) {
		if (window._debug) {
			console.log(`URL: ${url}`);
			if (error === undefined) { error = e => { console.log("Error"); console.log(e); } }
		}
		this.Busy.setBusy(this, true);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'PUT',
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

	delete(url, callback, error) {
		if (window._debug) {
			console.log(`Delete URL: ${url}`);
			if (error === undefined) { error = e => { console.log("Error"); console.log(e); } }
		}
		this.Busy.setBusy(this, true);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'DELETE',
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

	errorHandler(msg) {
		return res => { this.Footers.addFooter(msg + (res.message ? " - " + res.message : "")); }
	}

	remoteCompetitionService() {
		return {
			loadCompetitionList: (callback) => { this.load(`${Server.baseUrl}/competition`, callback); },
			loadCompetition: (id, callback) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(id) : `${Server.baseUrl}/competition/${id}`, callback); },
			createCompetition: (competition, callback, error) => { this.send(`${Server.baseUrl}/competition`, competition, callback, error || this.errorHandler("Kan inte skapa tävling")); },
			updateCompetition: (id, competition, callback, error) => { this.update(`${Server.baseUrl}/competition/${id}`, competition, callback, error || this.errorHandler("Kan inte uppdatera tävling")); },
			deleteCompetition: (id, callback, error) => { this.delete(`${Server.baseUrl}/competition/${id}`, callback, error || this.errorHandler("Kan inte radera tävling")); }
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
		this.setLocal(this.Storage.get(this.Storage.keys.toggleServerMode) && this.Storage.get(this.Storage.keys.serverMode));
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
	loadCompetitionList(callback, error) { this.competitionService.loadCompetitionList(this.logFetchCallback("Loading competition list", callback), error); }
	loadCompetition(competitionId, callback, error) { this.competitionService.loadCompetition(competitionId, this.logFetchCallback("Loading competition data", callback), error); }
	createCompetition(competition, callback, error) { this.competitionService.createCompetition(competition, this.logSendCallback("Creating new competition", competition, callback), error); }
	updateCompetition(competition, callback, error) { this.competitionService.updateCompetition(competition, this.logSendCallback("Updating competition", competition, callback), error); }
	deleteCompetition(competitionId, callback, error) { this.competitionService.deleteCompetition(competitionId, this.logSendCallback("Deleting competition", competitionId, callback), error); }
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
	login(user, password, callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.send(`${Server.baseUrl}/login`, { user: user, password: password }, this.logSendCallback("Login", user, callback), error || this.errorHandler("Kunde inte logga in"));
		}
	}

	logout(callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.load(`${Server.baseUrl}/logout`, this.logFetchCallback("Logout", callback), error);
		}
	}
	//#endregion
}