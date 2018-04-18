export class Validation {
	competitionInfo;

	constructor(competitionInfo, errors) {
		this.competitionInfo = competitionInfo;
	}

	error(desc, p) {
		return { error: desc, participant: p }
	}

	validateParticipantInfo(p) {
		p.errors = [];
		if (p.name === undefined || p.name === "") {
			p.errors.push(this.error("Namn saknas!", p));
		}
		if (p.competitionId === undefined || p.competitionId === "") {
			p.errors.push(this.error(p.name !== undefined && p.name !== "" ? p.name + " saknar ID!" : "Ogiltigt ID!", p));
		}
		if (p.organization === undefined || p.organization === "") {
			p.errors.push(this.error(p.name !== undefined && p.name !== "" ? p.name + " har ingen förening!" : "Ogiltig förening!", p));
		}
	}

	validateAtLeastOneRegistration(p) {
		let pReg = false;
		p.registrationInfo.forEach(r => { if (r) { pReg = true; } });
		if (!pReg) { p.errors.push(this.error("Ingen start vald!", p)); }
	}

	validateParticipant(p) {
		this.validateParticipantInfo(p);
		this.validateAtLeastOneRegistration(p);
	}

	validate(participants) {
		let errors = [];
		participants.forEach(p => {
			this.validateParticipant(p);
			errors = errors.concat(p.errors);
		});
		return errors;
	}
}