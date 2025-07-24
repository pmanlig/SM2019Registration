import { Status } from '.';

export class CompetitionGroup {
	constructor(id, label, name, description, icon, url, background, color, status) {
		this.id = id;
		this.label = label;
		this.name = name;
		this.description = description;
		this.icon = icon;
		this.url = url;
		this.background = background;
		this.color = color;
		this.status = status;
	}

	static fromJson({ id, label, name, description, icon, url, background, color, status }) {
		function parse(i) { return typeof i === "number" ? i : parseInt(i, 10); }
		if (status === undefined) {
			status = Status.Open;
			try {
				let x = JSON.parse(description);
				description = x.d;
				status = x.s;
			} catch (e) { }
		} else {
			status = parse(status);
		}
		return new CompetitionGroup(parse(id), label, name, description, icon, url, background, color, status);
	}

	static toJson(g) {
		return {
			id: g.id,
			label: g.label,
			name: g.name,
			description: JSON.stringify({ d: g.description, s: g.status }),
			icon: g.icon,
			background: g.background,
			color: g.color,
			users: []
		}
	}
}