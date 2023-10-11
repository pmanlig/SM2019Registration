import { Discipline } from "./Discipline";

class PrecisionScoring {
	static validateScore(participant, event, stage) { return true; }
}

class FieldScoring {
	static validateScore(participant, event, stage) {
		// let stageDef = event.stages.find(s => s.num === stage);
		return true;
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