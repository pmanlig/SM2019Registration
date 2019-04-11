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
				this.classGroups.sort((a, b) => a.index - b.index);
				callback(this.classGroups);
			}, this.Footers.errorHandler("Kan inte hämta klassindelning"));
		} else {
			callback(this.classGroups);
		}
	}

	save(newList) {
		let index = 1;
		let deleteList = this.classGroups.filter(g => !newList.some(n => n.id === g.id));
		this.classGroups = newList;
		newList.forEach(g => g.index = index++);
		deleteList.forEach(g => this.Server.deleteClassGroup(g.id, () => { }));
		newList.forEach(g => {
			if (g.id < 1000) {
				this.Server.createClassGroup(g, cg => g.id = cg.id);
			} else {
				this.Server.updateClassGroup(g, () => { });
			}
		});
	}

	find(x) { return this.classGroups.find(x); }
}