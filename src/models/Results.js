import { ParticipantScore } from './ParticipantScore';

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers", "Busy"];

	competition = null;
	event = null;
	scores = [];

	initialize() {
		this.queue = this.Storage.get(this.Storage.keys.resultsQueue) || [];
		setInterval(this.trySendResults, 1000 * 60);
	}

	load(competitionId, eventId, force) {
		if (force || eventId !== this.lastEvent || this.lastTime === undefined || ((Date.now() - this.last) > 10 * 1000)) {
			this.lastEvent = eventId;
			this.lastTime = Date.now();
			this.Server.load(
				`competition/${competitionId}/event/${eventId}/participant`,
				json => {
					if (window._debug) { console.log("Loaded results", json); }
					this.competition = parseInt(competitionId, 10);
					this.event = parseInt(eventId, 10);
					this.scores = json.map(p => ParticipantScore.fromJson(p));
					this.fire(this.Events.resultsUpdated);
				},
				this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
		}
	}

	getScores(squad) {
		return squad ? this.scores.filter(s => s.squad === squad) : this.scores;
	}

	updateScore(event, scorecard) {
		let score = this.scores.find(p => p.id === scorecard);
		score = { ...score, score: score.scores };
		this.queue.push({
			competition: this.competition,
			event: event,
			squad: score.squad,
			scores: [score]
		});
		if (window._debug) { console.log("Queueing score update", this.queue); }
		this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
		this.fire(this.Events.resultsUpdated);
		this.trySendResults();
	}

	report(event, squad, stage) {
		let scores = this.scores.filter(p => p.squad === squad.id).map(p => p.toStageJson(stage));
		if (scores.length > 0) {
			this.queue.push({
				competition: this.competition,
				event: event.id,
				squad: squad.id,
				scores: scores
			});
			if (window._debug) { console.log("Adding score to queue", this.queue); }
			this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
			this.fire(this.Events.resultsUpdated);
		}
		this.trySendResults();
	}

	trySendResults = () => {
		if (this.queue.length > 0) {
			let res = this.queue[0];
			this.Server.send(`competition/${res.competition}/event/${res.event}/participant`, res.scores,
				json => {
					this.queue = this.queue.filter(r => r !== res);
					if (window._debug) { console.log("Successfully sent results"); }
					this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
					this.fire(this.Events.resultsUpdated);
					if (this.queue.length > 0) {
						this.trySendResults();
					} else {
						if (this.lastEvent) {
							this.load(this.Competition.id, this.lastEvent, true);
						}
					}
				},
				error => { console.log("Error sending results", error, error.message, JSON.stringify(error)); }
			);
		}
		// Do not periodically load results - that will screw up result entry
	}

	clearQueue() {
		this.queue = [];
		this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
		this.fire(this.Events.resultsUpdated);
	}
}