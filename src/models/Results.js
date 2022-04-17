import { ParticipantScore } from './ParticipantScore';

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers", "Busy"];

	scores = [];

	initialize() {
		this.queue = this.Storage.get(this.Storage.keys.resultsQueue) || [];
		setInterval(this.trySendResults, 1000 * 60);
	}

	load(competitionId, eventId) {
		this.Busy.wrap(
			this.Server.load,
			`competition/${competitionId}/event/${eventId}/participant`,
			json => {
				if (window._debug) { console.log("Loaded results", json); }
				this.competition = parseInt(competitionId, 10);
				this.event = parseInt(eventId, 10);
				this.scores = json.map(p => ParticipantScore.fromJson(p));
				console.log("Loaded scores", this.scores);
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
					score: p.scores.filter(n => n.stage === stage)
				}
			})
		});
		if (window._debug) { console.log("Adding score to queue", this.queue); }
		this.Storage.set(this.Storage.keys.resultsQueue, this.queue);
		this.fire(this.Events.resultsUpdated);
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
}