export class DivisionsTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testReadDivisions, description: "Läser vapengrupper" },
			{ test: this.testCreateDivisions, description: "Skapar vapengrupper" },
			{ test: this.testDeleteDivisions, description: "Raderar vapengrupper" }
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

	testCreateDivisions = () => {
		let divisionGroup = {
			"description": "SPSF PPC",
			"divisions": ["SR2,75\"", "SR4\"", "SSA", "Dist. Revolver", "Dist. Pistol", "Open", "R1500", "P1500"]
		};
		console.log("Creating division group");
		console.log(divisionGroup);
		return new Promise(resolve => this.Server.createDivisionGroup(
			divisionGroup,
			s => {
				this.testID = s.id;
				resolve(true);
			},
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}

	testDeleteDivisions = () => {
		return new Promise(resolve => this.Server.deleteDivisionGroup(
			this.testID,
			s => resolve(true),
			e => resolve(false)));
	}
}