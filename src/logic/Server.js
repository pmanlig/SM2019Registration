export class Server {
	static register = { name: "Server", createInstance: true };
	static wire = ["Busy", "Storage", "ScheduleService"];
	static baseUrl = 'https://dev.bitnux.com/sm2019';

	jsonFile(name) {
		return `${process.env.PUBLIC_URL}/${name}.json`;
	}

	load(url, callback) {
		this.Busy.setBusy(this, true);
		if (window._debug) { console.log("Fetching URL " + url); }
		fetch(url)
			.then(result => result.json())
			.then(json => {
				if (window._debug) { console.log(json); }
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

	loadCompetition(competitionId, callback) {
		console.log("Loading competition data");
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ?
			this.jsonFile(competitionId) :
			`${Server.baseUrl}/competition/${competitionId}`, callback);
	}

	loadRegistration(competitionId, token, callback) {
		console.log("Loading competition registration data for competition " + competitionId);
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ?
			this.jsonFile(`${competitionId}_token`) :
			`${Server.baseUrl}/competition/${competitionId}/${token}`, callback);
	}

	loadResults(competitionId, eventId, callback) {
		console.log("Loading competition results for competition " + competitionId);
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ?
			this.jsonFile(`${competitionId}_result`) :
			`${Server.baseUrl}/result/${competitionId}`, callback);
	}

	createSchedule(callback) {
		console.log("Creating schedule");
		// ToDo: connect to real service instead
		this.ScheduleService.createNewSchedule(callback);
	}

	loadSchedule(scheduleId, callback) {
		// ToDo: connect to real service instead
		this.ScheduleService.getSchedule(scheduleId, callback);
		/*
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ?
			this.jsonFile(`${competitionId}_schedule`) :
			`${Server.baseUrl}/schedule/${scheduleId}`, callback);
			*/
	}

	updateSchedule(schedule) {
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