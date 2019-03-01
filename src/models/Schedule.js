import { Squad } from '.';
import { Time } from '../logic';

export class Schedule {
	nextSquadId = 1;
	squads = [];
	duration = "2:00";

	static fromJson(s) {
		let schedule = new Schedule();
		schedule.id = s.id;
		schedule.nextSquadId = s.squads && s.squads.length > 0 ? Math.max(...s.squads.map(sq => parseInt(sq.id.toString(), 10))) : 1;
		// ToDo: why is null present?
		schedule.squads = s.squads ? s.squads.filter(x => x !== null).map(s => Squad.fromJson(s)) : [];
		schedule.duration = s.duration ? Time.format(parseInt(s.duration.toString(), 10)) : "2:00";
		return schedule;
	}

	toJson() {
		return {
			id: this.id,
			squads: this.squads,
			duration: Time.durationFromText(this.duration),
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