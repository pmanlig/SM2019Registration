export class DivisionGroups {
	static register = { name: "DivisionGroups", createInstance: true };
	static wire = ["Server", "Footers"];

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
				this.divisionGroups.sort((a, b) => a.index - b.index);
				callback(this.divisionGroups);
			}, this.Footers.errorHandler("Kan inte hämta vapengruppsindelning"));
		} else {
			callback(this.divisionGroups);
		}
	}

	save(newList) {
		let index = 1;
		let deleteList = this.divisionGroups.filter(g => !newList.some(n => n.id === g.id));
		this.divisionGroups = newList;
		newList.forEach(g => g.index = index++);
		deleteList.forEach(g => this.Server.deleteDivisionGroup(g.id, () => { }));
		newList.forEach(g => this.Server.updateDivisionGroup(g, () => { }));
	}

	find(x) { return this.divisionGroups.find(x); }
}