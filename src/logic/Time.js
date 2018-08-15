export class Time {
	time = 0;

	constructor(t) {
		if (typeof t === "number") { this.time = Math.trunc(t); }
		if (typeof t === "string") { this.setValue(t); }
	}

	static canSetValue(text) {
		return text.toString().match(/^[0-2]?\d?:?[0-5]?\d?$/);
	}

	pad(number, length) {
		return number.toString().length < length ? "0" + number : number;
	}

	setValue(text) {
		let [hrs, mins] = text.split(":");
		hrs = this.pad(hrs, 2);
		mins = mins ? this.pad(mins, 2) : "00";
		this.time = parseInt(hrs, 10) * 60 + parseInt(mins, 10);
	}

	increase(t) {
		this.time += t;
		return this;
	}

	toString() {
		return `${this.hours()}:${this.pad(this.minutes(), 2)}`;
	}

	hours() {
		return Math.trunc(this.time / 60);
	}

	minutes() {
		return this.time % 60;
	}
}