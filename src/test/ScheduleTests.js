import { Schedule } from '../models';

export class ScheduleTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testCreateSchedule, description: "Skapa startlista" },
			{ test: this.testLoadSchedule, description: "Ladda startlista" },
			{ test: this.testUpdateSchedule, description: "Uppdatera startlista" },
			{ test: this.testMultipleUpdate, description: "Uppdatera startlista flera gånger" },
			{ test: this.testDeleteSchedule, description: "Radera startlista" }
		];
	}

	async createSchedule(schedule) {
		return new Promise(resolve => this.Server.createSchedule(schedule.toJson(),
			res => resolve(res),
			err => {
				console.log("Could not create schedule: " + JSON.stringify(err));
				resolve(null);
			}));
	}

	async loadSchedule(id) {
		return new Promise(resolve => this.Server.loadSchedule(id,
			s => resolve(s),
			e => {
				console.log("Could not get schedule: " + JSON.stringify(e));
				resolve(null);
			}));
	}

	async updateSchedule(schedule) {
		return new Promise(resolve => this.Server.updateSchedule(schedule.toJson(),
			s => resolve(true),
			e => {
				console.log("Could not update schedule: " + JSON.stringify(e));
				resolve(false);
			}
		));
	}

	async deleteSchedule(id) {
		return new Promise(resolve =>
			this.Server.deleteSchedule(id,
				s => resolve(true),
				e => {
					console.log("Could not delete schedule: " + JSON.stringify(e));
					resolve(false);
				}));
	}

	testCreateSchedule = async () => {
		this.testSchedule = new Schedule();
		let res = await this.createSchedule(this.testSchedule);
		if (res === null) return false;
		this.testSchedule.id = res.id;
		return true;
	}

	testUpdateSchedule = async () => {
		this.testSchedule.addSquad("8:00", 10, ["C", "B", "A", "R"], true);
		return this.updateSchedule(this.testSchedule);
	}

	testLoadSchedule = async () => {
		let schedule = await this.loadSchedule(this.testSchedule.id);
		return schedule !== null;
	}

	testMultipleUpdate = async () => {
		this.testSchedule = await this.loadSchedule(this.testSchedule.id);
		let res = await this.updateSchedule(Schedule.fromJson(this.testSchedule));
		if (!res) return false;
		this.testSchedule = await this.loadSchedule(this.testSchedule.id);
		res = await this.updateSchedule(Schedule.fromJson(this.testSchedule));
		if (!res) return false;
		this.testSchedule = await this.loadSchedule(this.testSchedule.id);
		if (this.testSchedule.squads[0].divisions.length !== 4) {
			console.log(`Error! Multiples of divisions created: [${this.testSchedule.squads[0].divisions.join()}] Expected: [C, B, A, R]`);
			return false;
		}
		return true;
	}

	testDeleteSchedule = () => {
		return this.deleteSchedule(this.testSchedule.id);
	}
}