import { ParticipantScore } from './ParticipantScore';

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers"];

	scores = [];

	load(competitionId, eventId) {
		// ToDo: don't load this unnecessarily
		this.Server.loadResults(competitionId, eventId, json => { // Endpoint doesn't exist yet
			// ToDo: old code
			this.scores = json;
			let localScores = this.Storage.get(this.Storage.keys.results);
			if (localScores) {
				localScores.forEach(ls => {
					this.scores.forEach(s => {
						if (s.id === ls.id) {
							s.score = ls.score;
							s.dirty = true;
						}
					});
				});
			}
			this.scores.forEach(p => this.calculate(p));
			this.sort();
			this.fire(this.Events.resultsUpdated);
		}, () => this.createScores(competitionId, eventId));
	}

	createScores(competitionId, eventId) {
		this.Server.loadRoster(competitionId, json => {
			this.scores = json.filter(p => parseInt(p.event_id, 10) === eventId).map(p => ParticipantScore.fromJson(p));
			this.fire(this.Events.resultsUpdated);
		}, this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	getScores(squad) {
		return squad ? this.scores.filter(s => s.squad === squad) : this.scores;
	}

	/** Old code vv */

	calculate(participant) {
		let total = [];
		participant.score.forEach(s => {
			for (let i = 0; i < s.length; i++) {
				if (!total[i]) {
					total[i] = 0;
				}
				total[i] += parseInt(s[i], 10);
			}
		});
		participant.total = total;
	}

	update(participant, score, set, value) {
		this.scores.forEach(p => {
			if (p.id === participant.id) {
				p.dirty = true;
				p.score[score][set] = value;
				this.calculate(p);
				this.fire(this.Events.resultsUpdated);
			}
		});
	}

	store() {
		this.Storage.set(this.Storage.keys.results, this.scores.filter(p => p.dirty));
		// ToDo: implement sending results to server
		// this.scores.forEach(p => { p.dirty = undefined; });
		this.dirty = false;
		this.fire(this.Events.resultsUpdated);
	}

	isDirty() {
		return this.dirty || this.scores.some(p => p.dirty);
	}

	sort() {
		this.scores.sort((a, b) => {
			if (a.total[0] === 0 && b.total[0] > 0) { return -1; }
			if (b.total[0] === 0) { return 1; }
			for (let i = 0; i < a.total.length; i++) {
				let r = b.total[i] - a.total[i];
				if (r !== 0) {
					return r;
				}
			}
			return b.name - a.name;
		});
		this.dirty = true;
		this.fire(this.Events.resultsUpdated);
	}
}