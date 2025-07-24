import gpk from './../gpk_logo_wht.png';
import xkretsen from './../gavleborg.png';
import sm2022 from './../sm_2022.png';
import hille from './../hille.png';
import missing from './../missing.png';
import { CompetitionGroup } from '../models';

export class CompetitionGroups {
	static register = { name: "CompetitionGroups", createInstance: true };
	static wire = ["fire", "subscribe", "Events", "Server", "Footers"];
	static E_CANNOT_FETCH = "Kan inte hämta grupper";
	static E_CANNOT_UPDATE = "Kan inte spara ändringar";
	defaultGroup = {
		name: "Tävlingsanmälan",
		description: "Anmälningssystem Gävle PK",
		icon: gpk,
		background: "#000000",
		color: "#FFFFFF"
	}
	groups = [];
	icons = { GPK: gpk, XKRETSEN: xkretsen, SM2022: sm2022, HILLE: hille }
	active = null;

	loadGroups = () => {
		this.Server.loadCompetitionGroups(json => {
			this.groups = json.map(g => CompetitionGroup.fromJson(g));
			this.groups.forEach(g => g.iconPath = this.icons[g.icon] || missing);
			this.fire(this.Events.competitionGroupsUpdated);
		},
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_FETCH));
	}

	initialize() {
		this.subscribe(this.Events.configurationLoaded, this.loadGroups);
		this.active = this.defaultGroup;
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
		group[prop] = value;
		group.dirty = true;
	}

	deleteGroup(group) {
		this.Server.deleteCompetitionGroup(group,
			() => { this.loadGroups(); },
			this.Footers.errorHandler(CompetitionGroups.E_CANNOT_UPDATE));
	}

	newGroup() {
		let nG = {
			name: "Ny grupp",
			dirty: true
		};
		this.groups.push(nG);
		this.fire(this.Events.competitionGroupsUpdated);
		return nG;
	}

	save() {
		this.groups.forEach(g => {
			if (g.id === undefined) {
				this.Server.createCompetitionGroup(CompetitionGroup.toJson(g),
					() => { this.loadGroups(); },
					this.Footers.errorHandler(CompetitionGroups.E_CANNOT_UPDATE));
			} else if (g.dirty) {
				this.Server.updateCompetitionGroup(CompetitionGroup.toJson(g),
					() => { g.dirty = false; },
					this.Footers.errorHandler(CompetitionGroups.E_CANNOT_UPDATE));
			}
		});
	}
}