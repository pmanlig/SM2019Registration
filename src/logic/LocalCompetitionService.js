export class LocalCompetitionService {
	static register = { name: "CompetitionService", createInstance: true }
	static wire = ["Storage"];

	initialize() {
		this.competitions = this.Storage.get(this.Storage.keys.competitions) || [];
	}
}