import { Permissions } from '../models';

export class LocalCompetitionService {
	static register = { name: "CompetitionService", createInstance: true }
	static wire = ["Storage", "Session"];

	competitionId = 1;
	competitions = [];

	initialize() {
		let competitionData = this.Storage.get(this.Storage.keys.competitionService) || {};
		this.competitions = competitionData.competitions || [];
		this.competitionId = competitionData.id || 1;
	}

	store() {
		this.Storage.set(this.Storage.keys.competitionService, { competitions: this.competitions, id: this.competitionId });
	}

	permissions(c) {
		return c.creator === this.Session.user ? Permissions.Own : Permissions.Any;
	}

	loadCompetitionList(callback) {
		callback(this.competitions.map(c => {
			return {
				id: c.id,
				name: c.name,
				description: c.description,
				status: c.status,
				permissions: this.permissions(c)
			}
		}));
	}

	loadCompetition(id, callback) {
		let competition = this.competitions.find(c => c.id.toString() === id);
		if (competition) {
			competition = {
				...competition,
				permissions: this.permissions(competition),
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

	updateCompetition(id, competition, callback) {
		competition.creator = this.Session.user;
		this.competitions = this.competitions.map(c => ((c.id === competition.id) ? competition : c));
		this.store();
		callback(true);
	}

	deleteCompetition(id, callback) {
		let c = this.competitions.find(x => x.id === id);
		if (c.creator !== this.Session.user) { callback(false); return; }
		this.competitions = this.competitions.filter(c => c.id !== id);
		this.store();
		callback(true);
	}
}