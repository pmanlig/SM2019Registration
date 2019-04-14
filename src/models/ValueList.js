export class ValueList {
	constructor(listName, id, description, values) {
		this.listName = listName;
		this.id = id;
		this.description = description || "Ny lista";
		this[listName] = values || [];
	}

	static fromJson(json, listName) {
		let nl = new ValueList(listName);
		nl.id = parseInt(json.id, 10);
		nl.description = json.description;
		nl[listName] = json[listName].filter(c => !c.startsWith("#"));
		nl.index = parseInt(json.index.toString(), 10);
		nl.header = json[listName].find(c => c.startsWith("#"));
		if (nl.header) nl.header = nl.header.replace(/^#/, '');
		return nl;
	}

	jsonList() {
		return (this.header) ? this[this.listName].concat(["#" + this.header]) : this[this.listName];
	}

	toJson() {
		let l = {
			id: this.id,
			description: this.description,
			index: this.index
		};
		l[this.listName] = this.jsonList();
		return l;
	}
}