import { InjectedClass, Components } from '.';

export class Server extends InjectedClass {
	static baseUrl = 'https://dev.bitnux.com/sm2019/';

	load(url, callback) {
		this.inject(Components.Busy).setBusy(Components.Server, true);
		console.log("Fetching URL " + url);
		fetch(url)
			.then(result => result.json())
			.then(json => {
				console.log(json);
				callback(json);
				this.inject(Components.Busy).setBusy(Components.Server, false);
			})
			.catch(e => {
				console.log(e);
				this.inject(Components.Busy).setBusy(Components.Server, false);
			});
		// finally() not supported in several browsers :(
		// .finally(() => this.inject(Components.Busy).setBusy(Server.id, false));
	}

	loadCompetition(competitionId, callback) {
		console.log("Loading competition data");
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ? '/' + competitionId + '.json' : Server.baseUrl + 'competition/' + competitionId, callback);
	}

	loadRegistration(competitionId, token, callback) {
		console.log("Loading competition registration data for competition " + competitionId);
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ? '/' + competitionId + '_token.json' : Server.baseUrl + 'competition/' + competitionId + '/' + token, callback);
	}

	loadResults(competitionId, eventId, callback) {
		console.log("Loading competition results for competition " + competitionId);
		let numId = parseInt(competitionId, 10);
		this.load(isNaN(numId) ? '/' + competitionId + '_result.json' : Server.baseUrl + 'result/' + competitionId, callback);
	}

	eventList(reg, participant) {
		let events = [];
		for (let i = 0; i < participant.registrationInfo.length; i++) {
			if (participant.registrationInfo[i]) {
				events.push({ event: reg.competition.events[i].id });
			}
		}
		return events;
	}

	registrationJson(reg) {
		return JSON.stringify({
			competition: reg.competition.id,
			token: reg.competition.token,
			contact: { name: reg.contact.name, email: reg.contact.email, organization: reg.contact.organization, account: reg.contact.account },
			registration: reg.participants.map(p => {
				return {
					participant: {
						name: p.name,
						id: p.competitionId,
						organization: p.organization
					},
					entries: this.eventList(reg, p)
				};
			})
		});
	}

	sendRegistration(reg) {
		console.log("Sending registration");
		console.log(JSON.parse(this.registrationJson(reg)));
		this.inject(Components.Busy).setBusy(Components.Server, true);
		return fetch(Server.baseUrl + "register", {
			crossDomain: true,
			method: 'POST',
			body: this.registrationJson(reg),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(res => {
				this.inject(Components.Busy).setBusy(Components.Server, false);
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