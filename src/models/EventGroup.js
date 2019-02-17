export class EventGroup {
	constructor(id, name, events, classes) {
		this.id = id || 0;
		this.name = name;
		this.events = events || [];
		this.classes = classes;
	}

	static toNumber(x) {
		if (x === undefined) { return undefined; }
		x = parseInt(x.toString(), 10);
		return isNaN(x) ? undefined : x;
	}

	static fromJson(obj) {
		return new EventGroup(EventGroup.toNumber(obj.id), obj.name,
			obj.events ? obj.events.map(e => EventGroup.toNumber(e)) : [],
			obj.classes ? EventGroup.toNumber(obj.classes) : obj.classes
		);
	}
}