export class ParticipantScore {
	constructor(id, name, org, squad, division, cls, scores, eventId, eventName, position, note, redo, support) {
		this.id = id;
		this.name = name;
		this.organization = org;
		this.squad = squad;
		this.scores = scores || [];
		this.class = cls == null ? cls : ((division === "C") ? cls.split('/')[0] : cls.slice(cls.indexOf('/') + 1));
		this.division = division;
		this.eventId = eventId;
		this.eventName = eventName;
		this.position = position;
		this.note = note || "";
		this.redo = redo || 0;
		this.support = support || 0;
	}

	getScores(stage) {
		return this.scores.find(s => s.stage === stage);
	}

	getScore(stage, target) {
		let score = this.getScores(stage);
		return score && score.values[target];
	}

	setScore(stage, target, value) {
		let score = this.getScores(stage);
		if (score == null) {
			score = { stage: stage, values: [] }
			this.scores.push(score);
		}
		score.values[target] = value;
	}

	getStageTotal(stageDef) {
		let score = this.getScores(stageDef.num);
		if (score == null) return "0/0";
		let values = score.values.slice(0, stageDef.targets);
		return `${values.filter(v => v !== undefined).reduce((a, b) => a + b, 0)}/${values.filter(s => s > 0).length}`;
	}

	getPrecisionTotal(stage) {
		let score = this.getScores(stage);
		if (score == null) return "0";
		return `${score.values
			.filter(v => v !== undefined)
			.map(x => x === "X" ? 10 : x)
			.reduce((a, b) => a + b, 0)}`;
	}

	getTotal() {
		return "0";
	}

	toStageJson(stage) {
		return { ...this, score: this.scores.filter(n => stage === undefined || n.stage === stage) };
	}

	static fromJson(json) {
		return new ParticipantScore(
			parseInt(json.id, 10),
			json.name,
			json.organization,
			parseInt(json.squad, 10),
			json.division,
			json.class,
			json.score.map(s => {
				return {
					stage: parseInt(s.stage, 10),
					values: s.values.map(n => n === "X" ? "X" : parseInt(n, 10))
				}
			}),
			parseInt(json.event_id, 10),
			json.event_name,
			parseInt(json.position, 10),
			json.note,
			parseInt(json.redo, 10) || 0,
			parseInt(json.support, 10) || 0
		);
	}
}