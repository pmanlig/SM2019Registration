import gpk from './../gpk_logo_wht.png';
import gpkcolor from './../gpk_logo_color.png';
import xkretsen from './../gavleborg.png';
import sm2022 from './../sm_2022.png';
import hille from './../hille.png';
import missing from './../missing.png';
import lulea from './../Luleå.png';
import dalarna from './../Dalakretsen.png';
import uppsala from './../Uppsala.png';
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
	icons = { GPK: gpk, GPKCOLOR: gpkcolor, XKRETSEN: xkretsen, SM2022: sm2022, HILLE: hille, LULEA: lulea, DALARNA: dalarna, UPPSALA: uppsala }
	active = null;

	loadGroups = () => {
		this.Server.loadCompetitionGroups(json => {
			this.groups = json.map(g => CompetitionGroup.fromJson(g));
			this.groups.forEach(g => g.iconPath = this.icons[g.icon] || missing);
			this.sort();
			for (let i = 0; i < this.groups.length; i++) {
				if (this.groups[i].index === undefined) {
					this.groups[i].dirty = true;
				}
				this.groups[i].index = i;
			}
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

	moveUp(index) {
		if (index > 0) {
			this.groups[index].dirty = true;
			this.groups[index--].index--;
			this.groups[index].dirty = true;
			this.groups[index].index++;
			this.sort();
			this.fire(this.Events.competitionGroupsUpdated);
		}
	}

	moveDown(index) {
		if (index < this.groups.length - 1) {
			this.groups[index].dirty = true;
			this.groups[index++].index++;
			this.groups[index].dirty = true;
			this.groups[index].index--;
			this.sort();
			this.fire(this.Events.competitionGroupsUpdated);
		}
	}

	sort() {
		this.groups.sort((a, b) => a.index - b.index);
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