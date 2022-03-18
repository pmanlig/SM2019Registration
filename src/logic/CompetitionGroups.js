import gpk from './../gpk_logo_wht.png';
import xkretsen from './../gavleborg.png';
import sm2022 from './../sm_2022.png';

export class CompetitionGroups {
	static register = { name: "CompetitionGroups", createInstance: true };
	static wire = ["fire", "Events", "Server", "Footers"];
	static E_CANNOT_FETCH = "Kan inte hämta grupper";
	defaultGroup = {
		name: "Tävlingsanmälan",
		description: "Anmälningssystem Gävle PK",
		icon: gpk,
		background: "#000000",
		color: "#FFFFFF"
	}
	groups = [];
	icons = { GPK: gpk, XKRETSEN: xkretsen, SM2022: sm2022 }
	active = null;

	initialize() {
		this.active = this.defaultGroup;
		this.Server.loadCompetitionGroups(json => {
			this.groups = json;
			this.groups.forEach(g => g.icon = this.icons[g.icon] || gpk);
			this.fire(this.Events.competitionGroupsUpdated);
		},
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH))
	}

	setGroup(group) {
		if (group !== this.active) {
			this.active = group;
			this.fire(this.Events.competitionGroupsUpdated);
		}
	}

	findGroup(label) {
		return this.groups.find(g => g.label === label) || this.defaultGroup;
	}
}