import { logFetchCallback, logSendCallback, logSendCallback2, logUpdateCallback, logErrorHandler, logUrl } from './Log';

export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService", "RegistrationService"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	//#region Main fetch/send methods and helpers
	load(url, callback, error) {
		logUrl(url);
		this.Busy.setBusy(this, true);
		fetch(url, {
			crossDomain: true,
			credentials: 'include',
		})
			.then(res => {
				this.Busy.setBusy(this, false);
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(error);
			})
		// finally() not supported in several browsers :(
		// .finally(() => this.Busy.setBusy(Server.id, false));
	}

	send(url, data, callback, error) {
		logUrl(url);
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
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(() => callback(true)); // res.ok but no JSON returned
			});
	}

	update(url, data, callback, error) {
		logUrl(url);
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
				if (!res.ok) { this.handleSafely(res, error); } else
					callback(true);
			});
	}

	delete(url, callback, error) {
		logUrl(url);
		this.Busy.setBusy(this, true);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'DELETE',
		})
			.then(res => {
				this.Busy.setBusy(this, false);
				if (!res.ok) { this.handleSafely(res, error); } else
					callback(true);
			});
	}

	jsonFile(name) {
		return `${process.env.PUBLIC_URL}/${name}.json`;
	}

	handleSafely(res, error) {
		res.text().then(txt => {
			try {
				let json = JSON.parse(txt);
				error(json);
			} catch (e) {
				error(txt);
			}
		}).catch(error);
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

	//#region Competition
	loadCompetitionList(callback, error) {
		this.competitionService.loadCompetitionList(logFetchCallback(callback, "Loading competition list"), logErrorHandler(error));
	}

	loadCompetition(competitionId, callback, error) {
		this.competitionService.loadCompetition(competitionId, logFetchCallback(callback, `Loading competition data for competition ${competitionId}`), logErrorHandler(error));
	}

	createCompetition(competition, callback, error) {
		this.competitionService.createCompetition(competition, logSendCallback(callback, competition, "Creating new competition"), logErrorHandler(error));
	}

	updateCompetition(competition, callback, error) {
		this.competitionService.updateCompetition(competition, logSendCallback(callback, competition, "Updating competition"), logErrorHandler(error));
	}

	deleteCompetition(competitionId, callback, error) {
		this.competitionService.deleteCompetition(competitionId, logFetchCallback(callback, `Deleting competition ${competitionId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Results
	loadResults(competitionId, eventId, callback, error) {
		this.resultService.loadResults(competitionId, eventId, logFetchCallback(callback, `Loading competition results for ${competitionId}/${eventId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Registration
	loadRegistration(competitionId, token, callback, error) {
		this.registrationService.loadRegistration(competitionId, token, logFetchCallback(callback, `Loading registration data for ${competitionId}/${token}`), logErrorHandler(error));
	}

	sendRegistration(data, callback, error) {
		this.registrationService.sendRegistration(data, logSendCallback(callback, data, `Sending registration`), logErrorHandler(error));
	}
	//#endregion

	//#region Schedule
	createSchedule(schedule, callback, error) {
		this.scheduleService.createSchedule(schedule, logSendCallback2(callback, schedule, "Creating schedule"), logErrorHandler(error));
	}

	loadSchedule(scheduleId, callback, error) {
		this.scheduleService.getSchedule(scheduleId, logFetchCallback(callback, "Loading schedule"), logErrorHandler(error));
	}

	updateSchedule(schedule, callback, error) {
		this.scheduleService.updateSchedule(schedule, logUpdateCallback(callback, schedule, "Updating schedule"), logErrorHandler(error));
	}

	deleteSchedule(scheduleId, callback, error) {
		this.scheduleService.deleteSchedule(scheduleId, logFetchCallback(callback, `Deleting schedule ${scheduleId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Value lists
	loadClassGroups(callback, error) {
		this.categoryService.loadClassGroups(logFetchCallback(callback, "Loading class groups"), logErrorHandler(error));
	}

	loadDivisionGroups(callback, error) {
		this.categoryService.loadDivisionGroups(logFetchCallback(callback, "Loading division groups"), logErrorHandler(error));
	}

	createClassGroup(classGroup, callback, error) {
		this.send(`${Server.baseUrl}/classes`, classGroup, logUpdateCallback(callback, classGroup, "Creating ClassGroup"), logErrorHandler(error));
	}

	createDivisionGroup(divisionGroup, callback, error) {
		this.send(`${Server.baseUrl}/divisions`, divisionGroup, logUpdateCallback(callback, divisionGroup, "Uppdaterar vapengrupper"), logErrorHandler(error));
	}

	deleteClassGroup(classGroupId, callback, error) {
		this.delete(`${Server.baseUrl}/classes/${classGroupId}`, logFetchCallback(callback, `Raderar klassindelning ${classGroupId}`), logErrorHandler(error));
	}

	deleteDivisionGroup(divisionGroupId, callback, error) {
		this.delete(`${Server.baseUrl}/divisions/${divisionGroupId}`, logFetchCallback(callback, `Raderar vapengrupper ${divisionGroupId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Login
	login(user, password, callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.send(`${Server.baseUrl}/login`, { user: user, password: password }, logSendCallback(callback, user, "Login"), logErrorHandler(error));
		}
	}

	logout(callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.load(`${Server.baseUrl}/logout`, logFetchCallback(callback, "Logout"), logErrorHandler(error));
		}
	}
	//#endregion
}