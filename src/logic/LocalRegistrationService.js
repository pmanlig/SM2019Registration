export class LocalRegistrationService {
	static register = { name: "RegistrationService", createInstance: true };
	static wire = ["Storage"];

	initialize() {
		this.registrationData = this.Storage.get(this.Storage.keys.registrationService) || {};
	}

	findRegistrationData(competitionId, token) {
		let competitionData = this.registrationData[competitionId];
		if (competitionData === undefined || competitionData[token] === undefined) { return {} }
		return competitionData[token];
	}

	loadRegistration(competitionId, token, callback) {
		callback(this.findRegistrationData(competitionId, token));
	}

	generateToken(competitionData) {
		let token;
		while (token === undefined || competitionData[token] !== undefined) {
			token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
		}
		return token;
	}

	sendRegistration(data, callback, error) {
		if (window._debug) {
			console.log("Receiving registration data", data);
		}
		let competitionId = data.competition;
		if (competitionId === undefined) {
			error({ message: "TävlingsId måste anges!" });
			return;
		}
		let competitionData = this.registrationData[competitionId] || {};
		let token = data.token || this.generateToken(competitionData);
		competitionData[token] = data;
		this.registrationData[competitionId] = competitionData;
		this.Storage.set(this.Storage.keys.registrationService, this.registrationData);
		callback({ token: token });
	}
}