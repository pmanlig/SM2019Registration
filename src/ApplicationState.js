import { CompetitionInfo } from './models';
import { Validation } from './logic';

export class ApplicationState {
	static instance;

	registry = [];
	registration = [];
	storeParticipants = "Nej";
	competitionInfo = new CompetitionInfo("noComp", "No Competition");

	// Event handlers
	updateState;
	addMessage;

	constructor(updateState, addMessage) {
		this.updateState = updateState;
		this.addMessage = addMessage;
	}

	setCompetitionInfo(info) {
		this.competitionInfo = CompetitionInfo.fromJson(info);
	}

	validateRegistration = () => {
		let errors = [];
		let v = new Validation(this.competitionInfo, errors);
		this.registration.forEach(p => { p.error = false; v.validateParticipant(p); });
		errors.forEach(e => { e.participant.error = true; });
		return errors;
	}

	eventList(registrationInfo) {
		let events = [];
		for (let i = 0; i < registrationInfo.length; i++) {
			if (registrationInfo[i]) {
				events.push({ event: this.competitionInfo.events[i].id });
			}
		}
		return events;
	}
}