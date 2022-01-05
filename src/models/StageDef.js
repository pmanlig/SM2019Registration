export class StageDef {
	constructor(num, shots, targets, value, max, min) {
		this.num = num;
		this.shots = shots;
		this.targets = targets;
		this.value = value;
		this.max = max;
		this.min = min || 0;
	}
}