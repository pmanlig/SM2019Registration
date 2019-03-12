export class DivisionGroups {
	static register = { name: "DivisionGroups", createInstance: true };
	static wire = ["Server"];

	divisionGroups = [];

	fromJson(data) {
		return data.map(c => {
			return {
				...c,
				id: parseInt(c.id.toString(), 10)
			}
		});
	}

	load(callback) {
		if (this.divisionGroups.length === 0) {
			this.Server.loadDivisionGroups(data => {
				this.divisionGroups = this.fromJson(data);
				callback(this.divisionGroups);
			});
		} else {
			callback(null);
		}
	}

	find(x) { return this.divisionGroups.find(x); }
}