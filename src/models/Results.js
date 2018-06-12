import { InjectedClass, Components, Events, StorageKeys } from "../logic";

export class Results extends InjectedClass {
	competition = undefined;
	scores = [];

	constructor(injector) {
		super(injector);
		this.competition = this.inject(Components.Competition);
	}

	load(competitionId) {
		this.inject(Components.Server).loadResults(competitionId, undefined, json => {
			this.scores = json;
			let localScores = this.inject(Components.Storage).get(StorageKeys.results);
			localScores.forEach(ls => {
				this.scores.forEach(s => {
					if (s.id === ls.id) {
						s.score = ls.score;
						s.dirty = true;
					}
				});
			});
			this.scores.forEach(p => this.calculate(p));
			this.sort();
			this.fire(Events.resultsUpdated);
		});
	}

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
				this.fire(Events.resultsUpdated);
			}
		});
	}

	store() {
		this.inject(Components.Storage).set(StorageKeys.results, this.scores.filter(p => p.dirty));
		// ToDo: implement sending results to server
		// this.scores.forEach(p => { p.dirty = undefined; });
		this.dirty = false;
		this.fire(Events.resultsUpdated);
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
		this.fire(Events.resultsUpdated);
	}
}