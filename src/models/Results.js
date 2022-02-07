import { ParticipantScore } from './ParticipantScore';

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers"];

	scores = [];

	initialize() {
		this.queue = this.Storage.get(this.Storage.keys.resultsQueue) || [];
	}

	load(competitionId, eventId) {
		// ToDo: don't load this unnecessarily?
		this.Server.loadResults(competitionId, eventId, json => { // Endpoint doesn't exist yet
			// ToDo: implement
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

	report(event, squad, stage) {
		// ToDo: implement
		console.log("Storing results", event, squad, stage, this.scores);

		this.queue.push({
			event: event.id,
			squad: squad.id,
			scores: this.scores.filter(p => p.squad === squad.id).map(p => {
				return {
					id: p.id,
					scores: p.scores.filter(n => n.num === stage)
				}
			})
		});
		console.log(this.queue);
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