export class TeamValidation {
	constructor(competition) {
		this.competition = competition;
	}

	error(desc, team) {
		return { error: desc, team: team };
	}

	validateTeam(team, errors) {
		if (team.event === undefined) { errors.push(this.error("No event set", team)); return; }
		let event = this.competition.events.find(e => e.id === team.event);
		if (event === null) { errors.push(this.error("Deltävlingen finns inte!", team)); return; }
		if (event.teams.length <= team.index) { errors.push(this.error("Ingen lagdefinition!", team)); return; }
		let teamDef = event.teams[team.index];
		if (team.members.filter(m => m !== undefined && m !== null && m > 0).length < teamDef.members) {
			errors.push(this.error("Alla ordinarie platser i laget måste ha deltagare!", team));
		}
	}

	validate(teams) {
		let errors = [];
		teams.forEach(t => this.validateTeam(t, errors));
		return errors;
	}
}