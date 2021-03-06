import { Squad } from '.';
import { Time } from '../logic';

export class Schedule {
	nextSquadId = 1;
	squads = [];

	constructor(duration, divisionGroup) {
		this.duration = duration || "2:00";
		this.divisionGroup = divisionGroup || 0;
	}

	static fromJson(s, p) {
		let schedule = new Schedule();
		schedule.id = parseInt(s.id.toString(), 10);
		schedule.nextSquadId = s.squads && s.squads.length > 0 ? Math.max(...s.squads.map(sq => parseInt(sq.id.toString(), 10))) : 1;
		// ToDo: why is null present?
		if (p && s.squads) {
			s.squads.forEach(sq => {
				sq.participants = p.find(ps => ps.id === sq.id).entries;
			});
		}
		schedule.squads = s.squads ? s.squads.filter(x => x !== null).map(s => Squad.fromJson(s)) : [];
		schedule.duration = s.duration ? Time.format(parseInt(s.duration.toString(), 10)) : "2:00";
		schedule.divisionGroup = s.divisionGroup;
		return schedule;
	}

	toJson() {
		return {
			id: this.id,
			squads: this.squads.map(s => s.toJson()),
			duration: Time.durationFromText(this.duration),
			divisionGroup: this.divisionGroup
		};
	}

	addSquad(startTime, slots, divisions, mixed) {
		this.squads.push(new Squad(startTime, slots, divisions, mixed, this.nextSquadId++));
	}

	deleteSquad(squad) {
		this.squads = this.squads.filter(s => s.id !== squad.id);
	}

	updateSquadProperty(squadId, property, value) {
		this.squads.forEach(s => { if (s.id === squadId) { s[property] = value; } });
	}
}