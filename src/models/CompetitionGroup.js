export class CompetitionGroup {
	constructor(id, label, name, description, icon, background, color, status) {
		this.id = id;
		this.label = label;
		this.name = name;
		this.description = description;
		this.icon = icon;
		this.background = background;
		this.color = color;
		this.status = status;
	}

	static fromJson({ id, label, name, description, icon, background, color, status }) {
		function parse(i) { return typeof i === "number" ? i : parseInt(i, 10); }
		return new CompetitionGroup(parse(id), label, name, description, icon, background, color, parse(status));
	}

	static toJson(g) {
		return g;
	}
}