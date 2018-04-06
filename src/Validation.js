// import { Participant } from './Participant';
// import { CompetitionInfo } from './CompetitionInfo';

export class Validation {
	competitionInfo;
	errors;

	constructor(competitionInfo, errors) {
		this.competitionInfo = competitionInfo;
		this.errors = errors;
	}

	error(desc, p) {
		return { error: desc, participant: p }
	}

	validateParticipantInfo(p) {
		if (p.name === undefined || p.name === "") {
			this.errors.push(this.error("Namn saknas!", p));
		}
		if (p.competitionId === undefined || p.competitionId === "") {
			this.errors.push(this.error(p.name !== undefined && p.name !== "" ? p.name + " saknar ID!" : "Ogiltigt ID!", p));
		}
		if (p.organization === undefined || p.organization === "") {
			this.errors.push(this.error(p.name !== undefined && p.name !== "" ? p.name + " har ingen förening!" : "Ogiltig förening!", p));
		}
	}

	validateAtLeastOneRegistration(p) {
		let pReg = false;
		p.registrationInfo.forEach(r => { if (r) { pReg = true; } });
		if (!pReg) { this.errors.push(this.error("Ingen start vald för " + p.name, p)); }
	}

	validateParticipant(p) {
		this.validateParticipantInfo(p);
		this.validateAtLeastOneRegistration(p);
	}
}