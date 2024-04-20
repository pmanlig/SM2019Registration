import { Permissions } from "./Competition";

export class TabInfo {
	constructor(name, path, order, permissions, status) {
		this.name = name;
		this.path = path;
		this.order = order;
		this.permissions = permissions;
		this.status = status;
	}

	show(competition) {
		return competition.permissions >= Permissions.Admin ||
			(this.permissions <= competition.permissions &&
				(this.status === undefined || this.status === competition.status));
	}
}