import { ValueList } from './ValueList';

/** List of Divisions a participant can compete in. A Division is a way to separate participants
 * based on factors not related to the participants themselves. E.g. which equipment they are using.
 * Example: PPC SR2,75" is a Division separate from PPC SR4" */
export class DivisionGroup extends ValueList {
	constructor(id, description) {
		super("divisions", id, description);
	}

	static fromJson(json) {
		return ValueList.fromJson(json, "divisions");
	}
}

/** A list of ways a competition can be stratified into different Divisions.
 * Example: One entry might contain the different divisions for PPC, while another might contain the
 * ones for Precision shooting.
 */
export class DivisionGroups {
	static register = { name: "DivisionGroups", createInstance: true };
	static wire = ["Server", "Footers"];

	divisionGroups = [];

	forceLoad(callback) {
		this.Server.loadDivisionGroups(data => {
			this.divisionGroups = data.map(c => DivisionGroup.fromJson(c));
			this.divisionGroups.sort((a, b) => a.index - b.index);
			callback(this.divisionGroups);
		}, this.Footers.errorHandler("Kan inte hämta vapengruppsindelning"));
	}

	load(callback) {
		if (this.divisionGroups.length === 0) {
			this.forceLoad(callback);
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
		newList.forEach(g => {
			if (g.id < 1000) {
				this.Server.createDivisionGroup(g.toJson(), cg => g.id = parseInt(cg.id, 10));
			} else {
				this.Server.updateDivisionGroup(g.toJson(), () => { });
			}
		});
		// this.forceLoad(() => { });
	}

	find(x) { return this.divisionGroups.find(x); }
}