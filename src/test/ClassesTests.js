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
		return new Promise(resolve => this.Server.deleteClassGroup(
			this.testID,
			s => resolve(true),
			e => resolve(false)));
	}
}