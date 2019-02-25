export class Time {
	static pad(number, length) {
		return number.toString().length < length ? "0" + number : number;
	}

	static canSetTime(text) {
		return text.toString().match(/^[0-2]?\d?:?[0-5]?\d?$/);
	}

	static format(t) {
		return `${Math.trunc(t / 60)}:${Time.pad(t % 60, 2)}`;
	}

	static timeFromText(text) {
		let [hrs, mins] = text.split(":");
		hrs = parseInt(hrs, 10);
		if (!mins && hrs > 24) return hrs;
		return hrs * 60 + parseInt(mins || "0", 10);
	}

	static durationFromText(text) {
		let [hrs, mins] = text.split(":");
		if (!mins) return parseInt(hrs, 10);
		return parseInt(hrs, 10) * 60 + parseInt(mins, 10);
	}
}