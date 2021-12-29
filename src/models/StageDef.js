export class StageDef {
	constructor(num, shots, targets, values, max, min) {
		this.num = num;
		this.shots = shots;
		this.targets = targets;
		this.values = values;
		this.max = max;
		this.min = min || 0;
	}
}