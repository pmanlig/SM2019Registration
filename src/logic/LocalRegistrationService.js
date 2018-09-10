export class LocalRegistrationService {
	static register = { name: "RegistrationService", createInstance: true };
	static wire = ["Storage"];

	loadRegistration(competitionId, token, callback) {
	}
}