export class ClassGroups {
	static register = { name: "ClassGroups", createInstance: true };
	static wire = ["Server", "Footers"];

	classGroups = [];

	fromJson(data) {
		return data.map(c => {
			return {
				...c,
				id: parseInt(c.id.toString(), 10)
			}
		});
	}

	load(callback) {
		if (this.classGroups.length === 0) {
			this.Server.loadClassGroups(data => {
				this.classGroups = this.fromJson(data);
				callback(this.classGroups);
			}, this.Footers.errorHandler("Kan inte hämta klassindelning"));
		} else {
			callback(null);
		}
	}

	find(x) { return this.classGroups.find(x); }
}