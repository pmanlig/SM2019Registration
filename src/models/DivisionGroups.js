export class DivisionGroups {
	static register = { name: "DivisionGroups", createInstance: true };
	static wire = ["Server"];

	divisionGroups = [];

	load(callback) {
		if (this.divisionGroups.length === 0) {
			this.Server.loadDivisionGroups(data => {
				this.divisionGroups = data;
				callback(data);
			});
		} else {
			callback(null);
		}
	}

	find(x) { return this.divisionGroups.find(x); }
}