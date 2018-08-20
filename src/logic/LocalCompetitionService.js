import { Permissions } from '../models';

export class LocalCompetitionService {
	static register = { name: "CompetitionService", createInstance: true }
	static wire = ["Storage", "Session"];

	competitionId = 1;
	competitions = [];

	initialize() {
		let competitionData = this.Storage.get(this.Storage.keys.competitions) || {};
		this.competitions = competitionData.competitions || [];
		this.competitionId = competitionData.id || 1;
	}

	store() {
		this.Storage.set(this.Storage.keys.competitions, { competitions: this.competitions, id: this.competitionId });
	}

	loadCompetitionList(callback) {
		callback(this.competitions);
	}

	loadCompetition(id, callback) {
		let competition = this.competitions.find(c => c.id.toString() === id);
		if (competition) {
			competition = {
				...competition,
				permissions: competition.creator === this.Session.user ? Permissions.Own : Permissions.Any,
				id: competition.id.toString()
			}
		}
		callback(competition);
	}

	createCompetition(competition, callback) {
		competition.id = (this.competitionId++).toString();
		competition.creator = this.Session.user;
		this.competitions.push(competition);
		this.store();
		callback(competition.id);
	}
}