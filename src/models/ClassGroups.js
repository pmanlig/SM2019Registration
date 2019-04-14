import { ValueList } from './ValueList';

export class ClassGroup extends ValueList {
	constructor(id, description) {
		super("classes", id, description);
	}

	static fromJson(json) {
		return ValueList.fromJson(json, "classes");
	}
}

export class ClassGroups {
	static register = { name: "ClassGroups", createInstance: true };
	static wire = ["Server", "Footers"];

	classGroups = [];

	forceLoad(callback) {
		this.Server.loadClassGroups(data => {
			this.classGroups = data.map(c => ClassGroup.fromJson(c));
			this.classGroups.sort((a, b) => a.index - b.index);
			callback(this.classGroups);
		}, this.Footers.errorHandler("Kan inte hämta klassindelning"));
	}

	load(callback) {
		if (this.classGroups.length === 0) {
			this.forceLoad(callback);
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
				this.Server.createClassGroup(g.toJson(), cg => g.id = parseInt(cg.id, 10));
			} else {
				this.Server.updateClassGroup(g.toJson(), () => { });
			}
		});
	}

	find(x) { return this.classGroups.find(x); }
}