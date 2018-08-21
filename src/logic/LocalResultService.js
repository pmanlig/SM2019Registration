export class LocalResultService {
	static register = { name: "ResultService", createInstance: true };
	static wire = ["Storage"];

	initialize() {
		this.results = this.Storage.get(this.Storage.keys.resultService) || [];
	}
	
	loadResults(competitionId, eventId, callback) {
		let results = this.results.find(r => r.id === competitionId && r.event === eventId);
		callback(results ? results.data : []);
	}
}