export class LocalCompetitionService {
	static register = { name: "CompetitionService", createInstance: true }
	static wire = ["Storage"];

	competitionId = 1;
	competitions = [];

	initialize() {
		let competitionData = this.Storage.get(this.Storage.keys.competitions) || {};
		this.competitions = competitionData.list || [];
		this.competitionId = competitionData.id || 1;
	}

	loadCompetitions(callback) {
		callback(this.competitions);
	}

	createCompetition(competition, callback) {
		let data = competition.toJson();
		data.id = this.competitionId++;
		this.competitions.push(data);
		this.Storage.set(this.Storage.keys.competitions, { competitions: this.competitions, id: this.competitionId });
		callback(data.id);
	}
}