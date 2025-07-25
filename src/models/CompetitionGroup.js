import { Status } from '.';

export class CompetitionGroup {
	constructor(id, label, name, description, icon, url, background, color, status, index) {
		this.id = id;
		this.label = label;
		this.name = name;
		this.description = description;
		this.icon = icon;
		this.url = url;
		this.background = background;
		this.color = color;
		this.status = status;
		this.index = index;
	}

	static fromJson({ id, label, name, description, icon, url, background, color, status, index }) {
		function parse(i) { return typeof i === "string" ? parseInt(i, 10) : i; }
		let x = {};
		try { x = JSON.parse(description); } catch (e) { }
		description = x.d ?? description;
		status = parse(status ?? x.s ?? Status.Open);
		index = parse(index ?? x.i);
		return new CompetitionGroup(parse(id), label, name, description, icon, url, background, color, status, index);
	}

	static toJson(g) {
		return {
			id: g.id,
			label: g.label,
			name: g.name,
			description: JSON.stringify({ d: g.description, s: g.status, i: g.index }),
			icon: g.icon,
			background: g.background,
			color: g.color,
			users: []
		}
	}
}