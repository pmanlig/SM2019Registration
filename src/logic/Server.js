export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["fire", "Events", "Busy", "Storage", "ScheduleService", "CompetitionService", "ResultService"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	initialize() {
		// ToDo: Change to false in production code
		this.setLocal(true);
	}

	setLocal(on) {
		this.local = on;
		if (this.local) {
			this.competitionService = this.CompetitionService;
			this.scheduleService = this.ScheduleService;
			this.resultService = this.ResultService;
		} else {
			this.competitionService = {
				loadCompetitionList: (callback) => { this.load(`${Server.baseUrl}/competition`, callback); },
				loadCompetition: (id, callback) => { this.load(isNaN(parseInt(id, 10)) ? this.jsonFile(id) : `${Server.baseUrl}/competition/${id}`, callback); },
				createCompetition: (competition, callback) => { console.log("Create competition - Not implemented"); }
			};
			this.resultService = {
				loadResults: (c, e, callback) => { this.load(isNaN(parseInt(c, 10)) ? this.jsonFile(`${c}_result`) : `${Server.baseUrl}/result/${c}/${e}`, callback); }
			};
		}
		this.fire(this.Events.serverChanged);
	}

	jsonFile(name) {
		return `${process.env.PUBLIC_URL}/${name}.json`;
	}

	logCallback(msg, c) {
		if (!window._debug) { return c; }
		return json => {
			console.log(msg);
			console.log(json);
			c(json);
		}
	}

	load(url, callback) {
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

	loadCompetitionList(callback) { this.competitionService.loadCompetitionList(this.logCallback("Loading competition list", callback)); }

	loadCompetition(competitionId, callback) { this.competitionService.loadCompetition(competitionId, this.logCallback("Loading competition data", callback)); }

	createCompetition(competition, callback) { this.competitionService.createCompetition(competition, this.logCallback("Creating new competition", callback)); }

	loadRegistration(competitionId, token, callback) {
		this.load(isNaN(parseInt(competitionId, 10)) ? this.jsonFile(`${competitionId}_token`) : `${Server.baseUrl}/competition/${competitionId}/${token}`,
			this.logCallback("Loading competition registration data for competition " + competitionId, callback));
	}

	loadResults(competitionId, eventId, callback) { this.resultService.loadResults(competitionId, eventId, this.logCallback(`Loading competition results for ${competitionId}/${eventId}`, callback)); }

	createSchedule(callback) {
		// ToDo: connect to real service instead
		this.ScheduleService.createNewSchedule(this.logCallback("Creating schedule", callback));
	}

	loadSchedule(scheduleId, callback) {
		// ToDo: connect to real service instead
		this.ScheduleService.getSchedule(scheduleId, this.logCallback("Loading schedule", callback));
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

	loadClassGroups(callback) {
		this.load(this.jsonFile("classes"), callback);
	}

	loadDivisionGroups(callback) {
		this.load(this.jsonFile("divisions"), callback);
	}

	registrationJson(reg) {
		return JSON.stringify({
			competition: reg.competition.id,
			token: reg.token,
			contact: { name: reg.contact.name, email: reg.contact.email, organization: reg.contact.organization, account: reg.contact.account },
			registration: reg.participants.map(p => {
				return {
					participant: {
						name: p.name,
						id: p.competitionId,
						organization: p.organization
					},
					entries: p.registrationInfo
				};
			})
		});
	}

	sendRegistration(reg) {
		console.log("Sending registration");
		console.log(JSON.parse(this.registrationJson(reg)));
		this.Busy.setBusy(this, true);
		return fetch(Server.baseUrl + "register", {
			crossDomain: true,
			method: 'POST',
			body: this.registrationJson(reg),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(res => {
				this.Busy.setBusy(this, false);
				console.log(res);
				if (res.ok) {
					return res.json();
				}
				/*
				// Don't remember why this was used before...?
				if (res.statusText) {
					throw Error(res.statusText);
				}
				*/
				return res.json().then(json => {
					console.log(json);
					throw Error(json.message);
				});
			});
	}
}