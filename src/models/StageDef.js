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
		return new StageDef(
			parseInt(json.num, 10),
			parseInt(json.targets, 10),
			json.value === "1",
			parseInt(json.max, 10),
			parseInt(json.min, 10),
			parseInt(json.shots, 10));
	}

	toJson() {
		return {
			num: this.num,
			targets: this.targets,
			value: this.value ? 1 : 0,
			max: this.max,
			min: this.min,
			shots: this.shots
		};
	}
}