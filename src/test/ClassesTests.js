export class ClassesTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testReadClasses, description: "Läser klassindelningar" }
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
}