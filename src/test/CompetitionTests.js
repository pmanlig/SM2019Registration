export class CompetitionTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testCreateCompetition, description: "Skapa tävling" },
			{ test: this.testDeleteCompetition, description: "Radera tävling" }
		];
	}

	testCreateCompetition = () => {
		this.testCompetition = {
			name: "__TestTävlingen__",
			description: "Automattest",
			status: 0,
			events: [{ name: "", date: Date.now(), maxRegistrations: 1 }]
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

	testUpdateCompetition = () => {
		return new Promise(resolve => this.Server.updateCompetition(
			this.testCompetition.id, this.testCompetition,
			s => resolve(true),
			e => {
				console.log(e);
				resolve(false);
			}
		));
	}

	testDeleteCompetition = () => {
		return new Promise(resolve => this.Server.deleteCompetition(this.testCompetition.id, s => resolve(true), e => resolve(false)));
	}
}