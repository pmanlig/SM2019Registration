export class DivisionsTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testReadDivisions, description: "Läser vapengrupper" }
		];
	}

	testReadDivisions = () => {
		return new Promise(resolve => this.Server.loadDivisionGroups(
			s => { resolve(true); },
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}
}