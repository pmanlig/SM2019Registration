import { InjectedClass, Components, Events } from '.';
import { Competition, Registration } from '../models';

export class CompetitionState extends InjectedClass {
	competitionId = null;
	competition = new Competition();
	registration = new Registration();

	loadCompetition(id) {
		this.competitionId = id;
		if (this.competition.id !== id) {
			this.inject(Components.Server).loadCompetition(id, json => {
				// Prevent multiple requests from screwing up the state
				if (json.id === this.competitionId) {
					this.competition = Competition.fromJson(json);
					this.fire(Events.competitionUpdated);
				}
			});
		}
	}

	loadRegistration(id, token) {

	}
}