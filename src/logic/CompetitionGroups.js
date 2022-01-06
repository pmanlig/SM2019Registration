export class CompetitionGroups {
	static register = { name: "CompetitionGroups", createInstance: true };
	static wire = ["fire", "Events", "Server", "Footers"];
	static E_CANNOT_FETCH = "Kan inte hämta grupper";
	groups = [];

	initialize() {
		this.Server.loadCompetitionGroups(json => {
			this.groups = json;
			this.fire(this.Events.competitionGroupsUpdated);
		},
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH))
	}
}