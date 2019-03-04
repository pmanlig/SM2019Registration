import { Schedule } from '../models';

export class ScheduleTests {
	static wire = ["Server"];

	tests() {
		return [
			{ test: this.testCreateSchedule, description: "Skapa startlista" },
			{ test: this.testUpdateSchedule, description: "Uppdatera startlista" },
			{ test: this.testDeleteSchedule, description: "Radera startlista" }
		];
	}

	testCreateSchedule = () => {
		this.testSchedule = new Schedule();
		return new Promise(resolve => this.Server.createSchedule(this.testSchedule.toJson(), res => {
			this.testSchedule.id = res.id;
			resolve(true);
		}, e => {
			console.log(e);
			resolve(false);
		}));
	}

	testUpdateSchedule = () => {
		return new Promise(resolve => {
			this.testSchedule.addSquad("8:00", 10, ["C", "B", "A", "R"], true);
			this.Server.updateSchedule(this.testSchedule.toJson(), s => resolve(true), e => {
				console.log("Error:");
				console.log(e);
				resolve(false);
			})
		});
	}

	testDeleteSchedule = () => {
		return new Promise(resolve =>
			this.Server.deleteSchedule(this.testSchedule.id, s => resolve(true), e => resolve(false)));
	}
}