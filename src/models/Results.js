import { StageDef } from ".";

export class ScoreTypes {
	static Field = 1;
	static Target = 2;
}

export class Results {
	static register = { name: "Results", createInstance: true };
	static wire = ["fire", "Competition", "Storage", "Server", "Events", "Footers"];

	scoreType = ScoreTypes.Field;
	displayScores = 3;
	scores = [];
	stageDefs = [];

	load(competitionId, eventId) {
		this.Server.loadStageDefs(competitionId, eventId, json => {
			// This endpoint doesn't exist yet, so we'll always have to rely on the error handler
			this.loadScores(competitionId, eventId);
		}, () => {
			this.createStageDefs(competitionId, eventId);
			this.loadScores(competitionId, eventId);
		});
		// this.Footers.errorHandler("Kan inte hämta tävlingskonfiguration"))
	}

	loadScores(competitionId, eventId) {
		this.Server.loadResults(competitionId, eventId, json => {
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

	createStageDefs() {
		this.scoreType = ScoreTypes.Field;
		this.displayScores = 3;
		this.stageDefs = [
			new StageDef(1, 6, 6, false, 6),
			new StageDef(2, 6, 4, false, 2, 1),
			new StageDef(3, 6, 1, true, 6),
			new StageDef(4, 6, 4, false, 3),
			new StageDef(5, 6, 5, false, 2, 1),
			new StageDef(6, 6, 2, false, 4),
			new StageDef(7, 6, 2, true, 3),
			new StageDef(8, 6, 1, false, 6)
		];
	}

	createScores(competitionId, eventId) {
		this.Server.loadRoster(competitionId, json => {
			this.scores = json.filter(p => parseInt(p.event_id, 10) === eventId).map(p => {
				// Need id for participant - participants can have the same name!
				return { id: 0, name: p.name, score: [], squad: p.squad }
			});
			this.fire(this.Events.resultsUpdated);
		}, this.Footers.errorHandler("Kan inte hämta deltagare för tävlingen"));
	}

	getScores(squad) {
		return squad ? this.scores.filter(s => s.squad === squad) : this.scores;
	}

	validateScores(stage, squad) {
		let stageDef = this.stageDefs[stage];
		let scores = this.getScores(squad);
		let error = false;
		scores.forEach(p => {
			p.error = undefined;
			let length = stageDef.targets + (stageDef.values ? 1 : 0);
			let targets = p.score[stage] || [];
			if (targets.length < length) {
				p.error = "Värde saknas"
			} else for (let t = 0; t < length; t++) {
				if (targets[t] === undefined) {
					p.error = "Värde saknas"
				}
			}
			targets = targets.slice(0, stageDef.targets);
			if (targets.some(t => t > stageDef.max) || targets.reduce((a, b) => a + b, 0) > stageDef.shots) {
				p.error = "För många träffar";
			}
			// ToDo: Add validation rules here
			error = error || p.error !== undefined;
		});
		return !error;
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