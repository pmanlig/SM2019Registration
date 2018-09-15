import { Schedule } from '../models';

export class LocalScheduleService {
	static register = { name: "ScheduleService", createInstance: true }
	static wire = ["Storage"];

	initialize() {
		this.schedules = this.Storage.get(this.Storage.keys.scheduleService) || [];
		// ToDo: remove backwards compatibility hack?
		this.schedules = this.schedules.filter(l => l !== undefined && l.id !== undefined).map(s => Schedule.fromJson(s));
		this.id = 1;
		this.schedules.forEach(s => { if (s.id >= this.id) { this.id = s.id + 1; } });
		if (window._debug) {
			console.log("Initialized Schedule Service");
			console.log(this);
		}
	}

	createNewSchedule(callback) {
		let newSchedule = new Schedule();
		newSchedule.id = this.id++;
		this.schedules.push(newSchedule);
		this.Storage.set(this.Storage.keys.scheduleService, this.schedules);
		callback(newSchedule);
	}

	getSchedule(scheduleId, callback) {
		callback(this.schedules.find(s => s.id === scheduleId) || Schedule.fromJson({ id: scheduleId, squads: [], squadId: 1 }));
	}

	updateSchedule(schedule) {
		console.log("Updating schedule");
		console.log(schedule);
		this.schedules = this.schedules.map(s => s.id === schedule.id ? schedule : s);
		this.Storage.set(this.Storage.keys.scheduleService, this.schedules);
	}
}