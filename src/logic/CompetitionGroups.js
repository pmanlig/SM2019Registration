import gpk from './../gpk_logo_wht.png';
import xkretsen from './../gavleborg.png';
import sm2022 from './../sm_2022.png';

export class CompetitionGroups {
	static register = { name: "CompetitionGroups", createInstance: true };
	static wire = ["fire", "Events", "Server", "Footers"];
	static E_CANNOT_FETCH = "Kan inte hämta grupper";
	groups = [];
	icons = { GPK: gpk, XKRETSEN: xkretsen, SM2022: sm2022 }
	active = null;

	initialize() {
		this.Server.loadCompetitionGroups(json => {
			this.groups = json;
			this.groups.forEach(g => g.icon = this.icons[g.icon] || gpk);
			this.fire(this.Events.competitionGroupsUpdated);
		},
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH))
	}

	setGroup(group) {
		this.active = group;
		this.fire(this.Events.competitionGroupsUpdated);
	}
}