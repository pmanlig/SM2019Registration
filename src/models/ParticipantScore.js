export class ParticipantScore {
	static E_MISSING_VALUE = "Värde saknas";
	static E_INCORRECT_SPREAD = "Träffarna inte fördelade korrekt";
	static E_TOO_MANY_HITS = "För många träffar";

	constructor(id, name, squad) {
		this.id = id;
		this.name = name;
		this.squad = squad;
		this.scores = [];
	}

	getScores(stage) {
		return this.scores.find(s => s.num === stage);
	}

	getScore(stage, target) {
		let score = this.getScores(stage);
		return score && score.values[target];
	}

	setScore(stage, target, value) {
		let score = this.getScores(stage);
		if (score == null) {
			score = { num: stage, values: [] }
			this.scores.push(score);
		}
		score.values[target] = value;
	}

	getTotal(stageDef) {
		let score = this.getScores(stageDef.num);
		if (score == null) return "0/0";
		let values = score.values.slice(0, stageDef.targets);
		return `${values.filter(v => v !== undefined).reduce((a, b) => a + b, 0)}/${values.filter(s => s > 0).length}`;
	}

	validateScore(stageDef) {
		this.error = null;
		let score = this.scores.find(s => s.num === stageDef.num);
		if (score == null) {
			this.error = ParticipantScore.E_MISSING_VALUE;
			return false;
		}
		let length = stageDef.targets + (stageDef.value ? 1 : 0);
		let values = score.values;
		if (values.length < length) {
			this.error = ParticipantScore.E_MISSING_VALUE;
			return false;
		} else for (let t = 0; t < length; t++) {
			if (values[t] == null) {
				this.error = ParticipantScore.E_MISSING_VALUE;
				return false;
			}
		}
		if (stageDef.min > 0) {
			let max = stageDef.shots + values.filter(t => t < stageDef.min).map(t => t - stageDef.min).reduce((a, b) => a + b, 0);
			if (values.reduce((a, b) => a + b, 0) > max) {
				this.error = ParticipantScore.E_INCORRECT_SPREAD;
				return false;
			}
		}
		values = values.slice(0, stageDef.targets);
		if (values.some(t => t > stageDef.max) || values.reduce((a, b) => a + b, 0) > stageDef.shots) {
			this.error = ParticipantScore.E_TOO_MANY_HITS;
			return false;
		}
		return true;
	}

	static fromJson(json) {
		return new ParticipantScore(0, json.name, parseInt(json.squad, 10));
	}
}