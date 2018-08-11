import { StorageKeys } from '.';
import { Schedule } from '../models';

export class DebugScheduleService {
	static register = { name: "ScheduleService", createInstance: true }
	static wire = ["Storage"];

	initialize() {
		console.log("Initialized Schedule Service");
		this.schedules = this.Storage.get(StorageKeys.schedules) || [];
		this.schedules = this.schedules.filter(l => l.id !== undefined).map(s => Schedule.fromJson(s));
		this.id = 1;
		this.schedules.forEach(s => { if (s.id >= this.id) { this.id = s.id + 1; } });
		console.log(this);
	}

	createNewSchedule(callback) {
		let newSchedule = new Schedule();
		newSchedule.id = this.id++;
		this.schedules.push(newSchedule);
		this.Storage.set(StorageKeys.schedules, this.schedules);
		console.log(newSchedule);
		callback(newSchedule);
	}

	getSchedule(scheduleId, callback) {
		callback(this.schedules.find(s => s.id === scheduleId));
	}

	updateSchedule(schedule) {
		console.log(schedule);
		console.log(this.schedules);
		this.schedules = this.schedules.map(s => s.id === schedule.id ? schedule : s);
		this.Storage.set(StorageKeys.schedules, this.schedules);
	}
}