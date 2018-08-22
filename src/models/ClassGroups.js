export class ClassGroups {
	static register = { name: "ClassGroups", createInstance: true };
	static wire = ["Server"];

	classGroups = [];

	load(callback) {
		if (this.classGroups.length === 0) {
			this.Server.loadClassGroups(data => {
				this.classGroups = data;
				callback(data);
			});
		} else {
			callback(null);
		}
	}

	find(x) { return this.classGroups.find(x); }
}