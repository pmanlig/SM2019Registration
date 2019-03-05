export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService", "RegistrationService", "Footers"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	//#region Main fetch/send methods and helpers
	load(url, callback, error) {
		if (window._debug) { console.log(`URL: ${url}`); }
		error = error || (e => console.log(e));
		this.Busy.setBusy(this, true);
		fetch(url, {
			crossDomain: true,
			credentials: 'include',
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
			})
		// finally() not supported in several browsers :(
		// .finally(() => this.Busy.setBusy(Server.id, false));
	}

	send(url, data, callback, error) {
		if (window._debug) {
			console.log(`URL: ${url}`);
			error = error || (e => { console.log("Error"); console.log(e); });
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
					.catch(callback); // res.ok but no JSON returned
			});
	}

	update(url, data, callback, error) {
		if (window._debug) {
			console.log(`URL: ${url}`);
			if (error === undefined) {
				console.log("Replacing error handler");
				error = e => { console.log("Error"); console.log(e); }
			}
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
					res.json().then(e => error(e));
				} else
					callback();
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
					res.json().then(e => error(e));
				} else
					callback();
			});
	}

	jsonFile(name) {
		return `${process.env.PUBLIC_URL}/${name}.json`;
	}

	errorHandler(msg, error) {
		return (error === undefined) ? (res => { this.Footers.addFooter(msg + (res.message ? " - " + res.message : "")); }) : error;
	}
	//#endregion

	//#region Remote Services
	remoteCompetitionService() {
		return {
			loadCompetitionList: (callback, error) => { this.load(`${Server.baseUrl}/competition`, callback, error); },
			loadCompetition: (id, callback, error) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(id) : `${Server.baseUrl}/competition/${id}`, callback, error); },
			createCompetition: (competition, callback, error) => { this.send(`${Server.baseUrl}/competition`, competition, callback, error); },
			updateCompetition: (competition, callback, error) => { this.update(`${Server.baseUrl}/competition/${competition.id}`, competition, callback, error); },
			deleteCompetition: (id, callback, error) => { this.delete(`${Server.baseUrl}/competition/${id}`, callback, error); }
		};
	}

	remoteResultService() {
		return {
			loadResults: (c, e, callback) => { this.load(isNaN(parseInt(c, 10)) ? this.jsonFile(`${c}_result`) : `${Server.baseUrl}/result/${c}/${e}`, callback); }
		};
	}

	remoteScheduleService() {
		return {
			createSchedule: (schedule, callback, error) => { this.send(`${Server.baseUrl}/schedules`, schedule, callback, error); },
			getSchedule: (scheduleId, callback, error) => { this.load(`${Server.baseUrl}/schedules/${scheduleId}`, callback, error); },
			updateSchedule: (schedule, callback, error) => { this.update(`${Server.baseUrl}/schedules/${schedule.id}`, schedule, callback, error); },
			deleteSchedule: (scheduleId, callback, error) => { this.delete(`${Server.baseUrl}/schedules/${scheduleId}`, callback, error); }
		};
	}

	remoteRegistrationService() {
		return {
			loadRegistration: (id, token, callback) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(`${id}_token`) : `${Server.baseUrl}/competition/${id}/${token}`, callback); },
			sendRegistration: (data, callback, error) => { this.send(`${Server.baseUrl}/register`, data, callback, error) }
		}
	}

	remoteCategoryServive() {
		return {
			loadClassGroups: (callback, error) => { this.load(`${Server.baseUrl}/classes`, callback, error); },
			loadDivisionGroups: (callback, error) => { this.load(`${Server.baseUrl}/divisions`, callback, error); }
		}
	}
	//#endregion

	//#region Local Services
	localCategoryServive() {
		return {
			loadClassGroups: (callback, error) => { this.load(this.jsonFile("classes"), callback); },
			loadDivisionGroups: (callback, error) => { this.load(this.jsonFile("divisions"), callback); }
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
			this.categoryService = this.localCategoryService();
		} else {
			this.competitionService = this.remoteCompetitionService();
			this.scheduleService = this.remoteScheduleService();
			this.resultService = this.remoteResultService();
			this.registrationService = this.remoteRegistrationService();
			this.categoryService = this.remoteCategoryServive();
		}
		this.Storage.set(this.Storage.keys.serverMode, this.local);
		this.fire(this.Events.serverChanged);
	}
	//#endregion

	//#region Logging
	logFetchCallback(msg, c) {
		if (!window._debug) { return c; }
		console.log(msg);
		return json => {
			console.log(json);
			c(json);
		}
	}

	logSendCallback(msg, data, c) {
		if (c === undefined) c = () => { };
		if (!window._debug) { return c; }
		console.log(msg);
		console.log(data);
		return json => {
			console.log("Reply:");
			console.log(json);
			c(json);
		}
	}

	logUpdateCallback(msg, data, c) {
		if (c === undefined) c = () => { };
		if (!window._debug) { return c; }
		console.log(msg);
		console.log(data);
		return c;
	}
	//#endregion

	//#region Competition
	loadCompetitionList(callback, error) { this.competitionService.loadCompetitionList(this.logFetchCallback("Loading competition list", callback), error); }
	loadCompetition(competitionId, callback, error) { this.competitionService.loadCompetition(competitionId, this.logFetchCallback("Loading competition data", callback), this.errorHandler("Kan inte hämta tävling", error)); }
	createCompetition(competition, callback, error) { this.competitionService.createCompetition(competition, this.logSendCallback("Creating new competition", competition, callback), this.errorHandler("Kan inte skapa tävling", error)); }
	updateCompetition(competition, callback, error) { this.competitionService.updateCompetition(competition, this.logSendCallback("Updating competition", competition, callback), this.errorHandler("Kan inte uppdatera tävling", error)); }
	deleteCompetition(competitionId, callback, error) { this.competitionService.deleteCompetition(competitionId, this.logSendCallback("Deleting competition", competitionId, callback), this.errorHandler("Kan inte radera tävling", error)); }
	//#endregion

	//#region Results
	loadResults(competitionId, eventId, callback) { this.resultService.loadResults(competitionId, eventId, this.logFetchCallback(`Loading competition results for ${competitionId}/${eventId}`, callback)); }
	//#endregion

	//#region Registration
	loadRegistration(competitionId, token, callback) { this.registrationService.loadRegistration(competitionId, token, this.logFetchCallback(`Loading registration data for ${competitionId}/${token}`, callback)); }
	sendRegistration(data, callback, error) { this.registrationService.sendRegistration(data, this.logSendCallback(`Sending registration`, data, callback), error); }
	//#endregion

	//#region Schedule
	createSchedule(schedule, callback, error) { this.scheduleService.createSchedule(schedule, this.logSendCallback("Creating schedule", schedule, callback), error); }
	loadSchedule(scheduleId, callback, error) { this.scheduleService.getSchedule(scheduleId, this.logFetchCallback("Loading schedule", callback), error); }
	updateSchedule(schedule, callback, error) { this.scheduleService.updateSchedule(schedule, this.logUpdateCallback("Updating schedule", schedule, callback), error); }
	deleteSchedule(scheduleId, callback, error) { this.scheduleService.deleteSchedule(scheduleId, this.logUpdateCallback("Deleting schedule", scheduleId, callback), error); }
	//#endregion

	//#region Value lists
	loadClassGroups(callback, error) { this.categoryService.loadClassGroups(this.logFetchCallback("Loading class groups", callback, error)); }
	loadDivisionGroups(callback, error) { this.categoryService.loadDivisionGroups(this.logFetchCallback("Loading division groups", callback, error)); }

	createClassGroup(classgroup, callback, error) { this.send(`${Server.baseUrl}/classes`, classgroup, callback, error); }
	createDivisionGroup(classgroup, callback, error) { this.send(`${Server.baseUrl}/divisions`, classgroup, callback, error); }

	deleteClassGroup(classGroupId, callback, error) { this.delete(`${Server.baseUrl}/classes/${classGroupId}`, callback, error); }
	deleteDivisionGroup(divisionGroupId, callback, error) { this.delete(`${Server.baseUrl}/divisions/${divisionGroupId}`, callback, error); }
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