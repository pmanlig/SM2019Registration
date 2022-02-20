import { ParticipantScore } from './ParticipantScore';

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers", "Busy"];

	scores = [];

	initialize() {
		this.queue = this.Storage.get(this.Storage.keys.resultsQueue) || [];
		console.log("Queue", this.queue);
		setInterval(this.trySendResults, 1000 * 60);
	}

	load(competitionId, eventId) {
		// ToDo: don't load this unnecessarily?
		this.Busy.wrap(
			this.Server.load,
			`competition/${competitionId}/event/${eventId}/participant`,
			json => {
				this.competition = competitionId;
				this.event = eventId;
				this.scores = json.map(p => ParticipantScore.fromJson(p));
				this.fire(this.Events.resultsUpdated);
			},
			this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	getScores(squad) {
		return squad ? this.scores.filter(s => s.squad === squad) : this.scores;
	}

	report(event, squad, stage) {
		this.queue.push({
			competition: this.competition,
			event: event.id,
			squad: squad.id,
			scores: this.scores.filter(p => p.squad === squad.id).map(p => {
				return {
					id: p.id,
					scores: p.scores.filter(n => n.num === stage)
				}
			})
		});
		this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
		this.fire(this.Events.resultsUpdated);
		this.trySendResults();
	}

	trySendResults = () => {
		console.log("Queue", this.queue);
		if (this.queue.length > 0) {
			let res = this.queue[0];
			this.Server.send(`competition/${res.competition}/event/${res.event}/participant`, res.scores,
				json => {
					this.queue = this.queue.filter(r => r !== res);
					console.log("Successfully sent results");
					this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
					this.fire(this.Events.resultsUpdated);
					this.trySendResults();
				},
				error => { console.log("Error sending results", error); }
			);
		}
	}

	clearQueue() {
		this.queue = [];
		this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
		this.fire(this.Events.resultsUpdated);
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