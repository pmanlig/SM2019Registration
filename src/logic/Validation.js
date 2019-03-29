export class Validation {
	static register = { name: "Validation" };
	competitionInfo;

	constructor(competitionInfo) {
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
			p.errors.push(this.error(p.name !== undefined && p.name !== "" ? `${p.name} saknar ID!` : "ID saknas!", p));
		}
		if (p.organization === undefined || p.organization === "") {
			p.errors.push(this.error(p.name !== undefined && p.name !== "" ? `${p.name} har ingen förening!` : "Förening saknas!", p));
		}
	}

	validateRegistration(p) {
		if (p.registrationInfo.length === 0) { p.errors.push(this.error("Ingen start vald!", p)); }
		p.registrationInfo.forEach(r => {
			let event = this.competitionInfo.event(r.event);
			if (event.classes && !r.class) p.errors.push(this.error("Ingen klass vald!", p));
			if (r.rounds) {
				r.rounds.forEach(rd => {
					if (event.divisions && !rd.division) p.errors.push(this.error("Ingen vapengrupp vald!", p));
					if (event.schedule && !rd.squad) p.errors.push(this.error("Ingen starttid vald!", p));
				});
			}
		});
	}

	validateParticipant(p) {
		this.validateParticipantInfo(p);
		this.validateRegistration(p);
	}

	validate(participants) {
		let errors = [];
		if (participants.length === 0) errors.push(this.error("Inga skyttar i anmälan!",null));
		participants.forEach(p => {
			this.validateParticipant(p);
			errors = errors.concat(p.errors);
		});
		return errors;
	}
}