import gpk from './../gpk_logo_wht.png';
import xkretsen from './../gavleborg.png';
import sm2022 from './../sm_2022.png';
import { CompetitionGroup } from '../models';

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
	defaults = [{
		id: 1,
		label: "traning_gpk",
		name: "Gävle PK",
		description: "Träningar och interna tävlingar Gävle PK",
		icon: "GPK",
		background: "#000000",
		color: "#FFFFFF",
		status: 1
	},
	{
		id: 2,
		label: "xkretsen",
		name: "X-kretsen",
		description: "Kretstävlingar Gävleborg",
		icon: "XKRETSEN",
		background: "#CFCFFF",
		color: "#000000",
		status: 1
	},
	{
		id: 3,
		label: "sm_2022",
		name: "SM Fält 2022",
		description: "Anmälan SM Fält 2022",
		icon: "SM2022",
		background: "#206196",
		color: "#000000",
		status: 0
	}];
	groups = [];
	icons = { GPK: gpk, XKRETSEN: xkretsen, SM2022: sm2022 }
	active = null;

	initialize() {
		this.active = this.defaultGroup;
		this.Server.loadCompetitionGroups(json => {
			this.groups = json.map(g => CompetitionGroup.fromJson(g));
			this.defaults.forEach(d => {
				if (!this.groups.some(g => g.id === d.id)) {
					this.groups.push(d);
				}
			});
			this.groups.forEach(g => g.iconPath = this.icons[g.icon] || gpk);
			this.fire(this.Events.competitionGroupsUpdated);
			this.Server.loadRemoteCompetitionGroups(json => {
				// TODO: Implement!!!
				console.log("Remote groups", json);
			}, this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH));
		},
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH));
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

	updateGroup(group, prop, value) {
		console.log("Group update", group, prop, value);
		group[prop] = value;
	}

	save() {

	}
}