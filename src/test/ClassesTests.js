/*let full = {
	description: "SPSF full klassindelning",
	classes: ["1", "2", "3", "Dam/1", "Dam/2", "Dam/3", "Jun/1", "Jun/2", "Jun/3", "VetY/1", "VetY/2", "VetY/3", "VetÄ/1", "VetÄ/2", "VetÄ/3"]
};*/

export class ClassesTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testReadClasses, description: "Läser klassindelningar" },
			{ test: this.testCreateClasses, description: "Skapar klassindelning" },
			{ test: this.testDeleteClasses, description: "Raderar klassindelning" }
		];
	}

	testReadClasses = () => {
		return new Promise(resolve => this.Server.loadClassGroups(
			s => { resolve(true); },
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}

	testCreateClasses = () => {
		let classGroup = {
			"description": "PPC",
			"classes": ["Marksman", "Sharpshooter", "Expert", "Master", "High Master"]
		};
		// this.Server.createClassGroup(full, s => { }, e => { });
		return new Promise(resolve => this.Server.createClassGroup(
			classGroup,
			s => {
				this.testID = s.id;
				resolve(true);
			},
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}

	testDeleteClasses = () => {
		// this.Server.deleteClassGroup(1101, s => { }, e => { });
		return new Promise(resolve => this.Server.deleteClassGroup(
			this.testID,
			s => resolve(true),
			e => resolve(false)));
	}
}