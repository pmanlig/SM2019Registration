import { Discipline } from "./Discipline";

const E_MISSING_VALUE = "Värde saknas";
const E_INCORRECT_SPREAD = "Träffarna inte fördelade korrekt";
const E_TOO_MANY_HITS = "För många träffar";

class PrecisionScoring {
	static validateScore(participant, event, stage) {
		participant.error = null;
		let score = participant.getScores(stage);
		if (score == null || score.values.length < 5 || score.values.some(s => s === null || s === undefined)) {
			participant.error = E_MISSING_VALUE;
			return false;
		}
		return true;
	}

	static total(participant, event) {
		return 0;
	}
}

class FieldScoring {
	static validateScore(participant, event, stage) {
		let stageDef = event.stages.find(s => s.num === stage);
		participant.error = null;
		let score = participant.getScores(stage);
		if (score == null) {
			participant.error = E_MISSING_VALUE;
			return false;
		}
		let length = stageDef.targets + (stageDef.value ? 1 : 0);
		let values = score.values;
		if (values.length < length) {
			participant.error = E_MISSING_VALUE;
			return false;
		} else for (let t = 0; t < length; t++) {
			if (values[t] == null) {
				participant.error = E_MISSING_VALUE;
				return false;
			}
		}
		if (stageDef.min > 0) {
			let max = stageDef.shots + values.filter(t => t < stageDef.min).map(t => t - stageDef.min).reduce((a, b) => a + b, 0);
			if (values.reduce((a, b) => a + b, 0) > max) {
				participant.error = E_INCORRECT_SPREAD;
				return false;
			}
		}
		values = values.slice(0, stageDef.targets);
		if (values.some(t => t > stageDef.max) || values.reduce((a, b) => a + b, 0) > stageDef.shots) {
			participant.error = E_TOO_MANY_HITS;
			return false;
		}
		return true;
	}

	static total(participant, event) {
		
	}
}

export class ScoringModels {
	static getModel(discipline) {
		switch (discipline) {
			case Discipline.target:
				return PrecisionScoring;
			case Discipline.fieldP:
			case Discipline.fieldK:
				return FieldScoring;
			default:
				return null;
		}
	}
}