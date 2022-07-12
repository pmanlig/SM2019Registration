import {
	logFetchCallback, logSendCallback, logSendCallback2,
	logUpdateCallback, logDeleteCallback, logErrorHandler, logUrl
} from './Log';

export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService", "RegistrationService", "Configuration"];

	initialize() {
		this.setLocal(this.Storage.get(this.Storage.keys.toggleServerMode) && this.Storage.get(this.Storage.keys.serverMode));
	}

	//#region Main fetch/send methods and helpers
	load = (url, callback, error) => {
		url = `${this.Configuration.baseUrl}/${url}`;
		logUrl(url);
		fetch(url, {
			crossDomain: true,
			credentials: 'include',
		})
			.then(res => {
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(error);
			})
		// finally() not supported in several browsers :(
		// .finally(() => this.Busy.setBusy(Server.id, false));
	}

	send = (url, data, callback, error) => {
		url = `${this.Configuration.baseUrl}/${url}`;
		logUrl(url);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(res => {
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(() => callback(true)); // res.ok but no JSON returned
			});
	}

	send2(url, data, callback, error) {
		this.Busy.wrap(this.send, url, data, callback, error);
	}

	update = (url, data, callback, error) => {
		url = `${this.Configuration.baseUrl}/${url}`;
		logUrl(url);
		console.log("Update", url, data);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'PUT',
			body: JSON.stringify(data),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(res => {
				if (!res.ok) { this.handleSafely(res, error); } else
					callback(true);
			});
	}

	update2(url, data, callback, error) {
		this.Busy.wrap(this.update, url, data, callback, error);
	}

	delete = (url, callback, error) => {
		url = `${this.Configuration.baseUrl}/${url}`;
		logUrl(url);
		return fetch(url, {
			crossDomain: true,
			credentials: 'include',
			method: 'DELETE',
		})
			.then(res => {
				if (!res.ok) { this.handleSafely(res, error); } else
					callback(true);
			});
	}

	delete2(url, callback, error) {
		this.Busy.wrap(this.delete, url, callback, error);
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
			loadCompetitionList: (callback, error) => { this.Busy.wrap(this.load, "competition", callback, error); },
			loadCompetition: (id, callback, error) => { this.Busy.wrap(this.load, isNaN(parseInt(id, 10)) ? this.jsonFile(id) : `competition/${id}`, callback, error); },
			createCompetition: (competition, callback, error) => { this.Busy.wrap(this.send, "competition", competition, callback, error); },
			updateCompetition: (competition, callback, error) => { this.Busy.wrap(this.update, `competition/${competition.id}`, competition, callback, error); },
			deleteCompetition: (id, callback, error) => { this.Busy.wrap(this.delete, `competition/${id}`, callback, error); },
			getParticipants: (id, callback, error) => { this.load(`competition/${id}/list`, callback, error); }
		};
	}

	remoteResultService() {
		return {
			loadResults: (competitionId, eventId, callback, error) => { this.Busy.wrap(this.load, `competition/${competitionId}/scores/${eventId}`, callback, error); }
		};
	}

	remoteScheduleService() {
		return {
			createSchedule: (schedule, callback, error) => { this.send2(`schedules`, schedule, callback, error); },
			getSchedule: (scheduleId, callback, error) => { this.load(`schedules/${scheduleId}`, callback, error); },
			getParticipants: (scheduleId, callback, error) => { this.Busy.wrap(this.load, `schedules/${scheduleId}/squad`, callback, error); },
			updateParticipants: (scheduleId, data, callback, error) => { this.update(`schedules/${scheduleId}/move`, data, callback, error); },
			updateSchedule: (schedule, callback, error) => { this.update2(`schedules/${schedule.id}`, schedule, callback, error); },
			deleteSchedule: (scheduleId, callback, error) => { this.delete2(`schedules/${scheduleId}`, callback, error); }
		};
	}

	remoteRegistrationService() {
		return {
			loadRegistration: (id, token, callback, error) => { this.Busy.wrap(this.load, isNaN(parseInt(id, 10)) ? this.jsonFile(`${id}_token`) : `competition/${id}/${token}`, callback, error); },
			sendRegistration: (data, callback, error) => { this.send2(`register`, data, callback, error) },
			updateRegistration: (token, data, callback, error) => { this.send2(`register/${token}`, data, callback, error) },
			deleteRegistration: (id, token, callback, error) => { this.delete2(`competition/${id}/${token}`, callback, error); },
		}
	}

	remoteCategoryService() {
		return {
			loadClassGroups: (callback, error) => { this.Busy.wrap(this.load, `classes`, callback, error); },
			loadDivisionGroups: (callback, error) => { this.Busy.wrap(this.load, `divisions`, callback, error); }
		}
	}

	remoteStagesService() {
		return {
			loadStageDefs: (competitionId, eventId, callback, error) => { this.Busy.wrap(this.load, `competition/${competitionId}/stages/${eventId}`, callback, error); }
		}
	}
	//#endregion

	//#region Local Services
	localCategoryServive() {
		return {
			loadClassGroups: (callback, error) => { this.Busy.wrap(this.load, this.jsonFile("classes"), callback); },
			loadDivisionGroups: (callback, error) => { this.Busy.wrap(this.load, this.jsonFile("divisions"), callback); }
		}
	}
	//#endregion

	//#region Property manipulation
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
			this.categoryService = this.remoteCategoryService();
		}
		this.stagesService = this.remoteStagesService();
		this.Storage.set(this.Storage.keys.serverMode, this.local);
		this.fire(this.Events.serverChanged);
	}
	//#endregion

	//#region Clubs
	loadClubs(callback, error) {
		error = logErrorHandler(error);
		this.Busy.setBusy(this, true);
		fetch("/clubs.json")
			.then(res => {
				this.Busy.setBusy(this, false);
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(error);
			})
	}
	//#endregion

	//#region Groups
	loadCompetitionGroups(callback, error) {
		const id = "lcg";
		this.Busy.setBusy(id, true);
		fetch("/groups.json")
			.then(res => {
				this.Busy.setBusy(id, false);
				if (!res.ok) { this.handleSafely(res, error); } else
					res.json()
						.then(callback)
						.catch(error);
			})
			.catch(() => {
				this.Busy.setBusy(id, false);
				error();
			});
	}

	loadRemoteCompetitionGroups(callback, error) {
		this.Busy.wrap(this.load, "group", callback, error);
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

	getCompetitionParticipants(competitionId, callback, error) {
		this.competitionService.getParticipants(competitionId, logFetchCallback(callback, `Getting participants for competition ${competitionId}`), logErrorHandler(error));
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

	updateRegistration(token, data, callback, error) {
		this.registrationService.updateRegistration(token, data, logSendCallback(callback, data, `Updating registration`), logErrorHandler(error));
	}

	sendNewToken(registration, callback, error) {
		this.send2(`competition/send_token`, registration, logSendCallback(callback, registration, `Begär nytt mail`), logErrorHandler(error))
	}

	deleteRegistration(competitionId, token, callback, error) {
		this.registrationService.deleteRegistration(competitionId, token, logDeleteCallback(callback, `Raderar anmälan ${token} i tävling ${competitionId}`), logErrorHandler(error));
	}

	loadRoster(competitionId, callback, error) {
		this.Busy.wrap(this.load, `competition/${competitionId}/list`, logFetchCallback(callback, `Hämtar deltagare för tävling ${competitionId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Schedule
	createSchedule(schedule, callback, error) {
		this.scheduleService.createSchedule(schedule, logSendCallback2(callback, schedule, "Creating schedule"), logErrorHandler(error));
	}

	loadSchedule(scheduleId, callback, error) {
		this.scheduleService.getSchedule(scheduleId, logFetchCallback(callback, "Loading schedule"), logErrorHandler(error));
	}

	loadParticipants(scheduleId, callback, error) {
		this.scheduleService.getParticipants(scheduleId, logFetchCallback(callback, "Loading participants"), logErrorHandler(error));
	}

	updateParticipants(scheduleId, data, callback, error) {
		this.scheduleService.updateParticipants(scheduleId, data, logUpdateCallback(callback, data, "Updating participants"), logErrorHandler(error));
	}

	updateSchedule(schedule, callback, error) {
		this.scheduleService.updateSchedule(schedule, logUpdateCallback(callback, schedule, "Updating schedule"), logErrorHandler(error));
	}

	deleteSchedule(scheduleId, callback, error) {
		this.scheduleService.deleteSchedule(scheduleId, logFetchCallback(callback, `Deleting schedule ${scheduleId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Stages
	loadStageDefs(competitionId, eventId, callback, error) {
		this.stagesService.loadStageDefs(competitionId, eventId, logFetchCallback(callback, `Loading stage definitions for ${competitionId}/${eventId}`), logErrorHandler(error));
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
		this.send2(`classes`, classGroup, logUpdateCallback(callback, classGroup, "Creating ClassGroup"), logErrorHandler(error));
	}

	createDivisionGroup(divisionGroup, callback, error) {
		this.send2(`divisions`, divisionGroup, logUpdateCallback(callback, divisionGroup, "Creating DivisionGroup"), logErrorHandler(error));
	}

	updateClassGroup(classGroup, callback, error) {
		this.update2(`classes/${classGroup.id}`, classGroup, logUpdateCallback(callback, classGroup, "Updating ClassGroup"), logErrorHandler(error));
	}

	updateDivisionGroup(divisionGroup, callback, error) {
		this.update2(`divisions/${divisionGroup.id}`, divisionGroup, logUpdateCallback(callback, divisionGroup, "Updating DivisionGroup"), logErrorHandler(error));
	}

	deleteClassGroup(classGroupId, callback, error) {
		this.delete2(`classes/${classGroupId}`, logFetchCallback(callback, `Deleting ClassGroup ${classGroupId}`), logErrorHandler(error));
	}

	deleteDivisionGroup(divisionGroupId, callback, error) {
		this.delete2(`divisions/${divisionGroupId}`, logFetchCallback(callback, `Deleting DivisionGroup ${divisionGroupId}`), logErrorHandler(error));
	}
	//#endregion

	//#region Login
	login(user, password, callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.send2(`login`, { user: user, password: password }, logSendCallback(callback, user, "Login"), logErrorHandler(error));
		}
	}

	logout(callback, error) {
		if (this.local) {
			callback({});
		} else {
			this.Busy.wrap(this.load, `logout`, logFetchCallback(callback, "Logout"), logErrorHandler(error));
		}
	}
	//#endregion

	//#region Admin
	getRegistrations(competitionId, callback, error) {
		this.Busy.wrap(this.load, `admin/competition/${competitionId}/list_token`, logFetchCallback(callback, "Getting registrations"), logErrorHandler(error));
	}

	getTeamRegistrations(competitionId, callback, error) {
		this.Busy.wrap(this.load, `admin/competition/${competitionId}/list_token_team`, logFetchCallback(callback, "Getting team registrations"), logErrorHandler(error));
	}
	//#endregion
}