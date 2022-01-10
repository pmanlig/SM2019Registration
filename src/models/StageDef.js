export class StageDef {
	constructor(num, targets, value, max, min, shots) {
		this.num = num;
		this.targets = targets || 1;
		this.value = value || false;
		this.max = max || 6;
		this.min = min || 0;
		this.shots = shots || 6;
	}

	static fromJson(json) {
		return new StageDef(json.num, json.shots, json.targets, json.value, json.max, json.min);

	}

	toJson() {
		return { ...this };
	}
}