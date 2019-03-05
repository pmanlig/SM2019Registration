export class CompetitionTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testCreateCompetition, description: "Skapa tävling" },
			{ test: this.testLoadCreatedCompetition, description: "Hämta skapad tävling" },
			{ test: this.testUpdateCompetition, description: "Uppdatera tävling" },
			{ test: this.testLoadChangedCompetition, description: "Hämta ändrad tävling" },
			{ test: this.testDeleteCompetition, description: "Radera tävling" },
			{ test: this.testCompetitionIsDeleted, description: "Kontrollerar att tävling raderades" }
		];
	}

	testCreateCompetition = () => {
		this.testCompetition = {
			name: "__TestTävlingen__",
			description: "Automattest",
			status: 0,
			events: [{ name: "", date: Date.now(), maxRegistrations: 1, id: 1 }]
		};
		return new Promise(resolve => this.Server.createCompetition(this.testCompetition,
			s => {
				this.testCompetition.id = s.id;
				resolve(true);
			},
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}

	testLoadCreatedCompetition = () => {
		return new Promise(resolve => this.Server.loadCompetition(
			this.testCompetition.id,
			s => {
				this.testCompetition = s;
				console.log("Loaded competition");
				console.log(JSON.parse(JSON.stringify(this.testCompetition)));
				resolve(this.testCompetition.events[0].classes === undefined &&
					this.testCompetition.events[0].divisions === undefined &&
					this.testCompetition.events[0].divisionGroup === undefined);
			},
			e => {
				console.log(e);
				resolve(false);
			}
		));
	}

	testLoadChangedCompetition = () => {
		return new Promise(resolve => this.Server.loadCompetition(
			this.testCompetition.id,
			s => {
				this.testCompetition = s;
				console.log("Loaded competition");
				console.log(JSON.parse(JSON.stringify(this.testCompetition)));
				resolve(parseInt(this.testCompetition.events[0].classes.toString(), 10) === 101 &&
					parseInt(this.testCompetition.events[0].divisions.toString(), 10) === 102 &&
					this.testCompetition.events[0].divisionGroup === undefined);
			},
			e => {
				console.log(e);
				resolve(false);
			}
		));
	}

	testUpdateCompetition = () => {
		this.testCompetition.events[0].classes = 101;
		this.testCompetition.events[0].divisions = 102;
		return new Promise(resolve => this.Server.updateCompetition(
			this.testCompetition,
			s => resolve(true),
			e => {
				console.log("Cannot update");
				console.log(e);
				resolve(false);
			}
		));
	}

	testDeleteCompetition = () => {
		return new Promise(resolve => this.Server.deleteCompetition(this.testCompetition.id, s => resolve(true), e => resolve(false)));
	}

	testCompetitionIsDeleted = () => {
		return new Promise(resolve => this.Server.loadCompetition(
			this.testCompetition.id,
			s => {
				console.log("Success");
				console.log(s);
				resolve(false);
			},
			e => {
				console.log("Error");
				console.log(e);
				resolve(true);
			}
		));
	}
}