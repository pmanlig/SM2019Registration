import { Person } from '.';

export class Registry {
	static register = { name: "Registry", createInstance: true };
	static wire = ["fire", "Storage", "Events"];

	initialize() {
		this.competitors = this.Storage.get(this.Storage.registry) || [];
	}

	storeCompetitors(participants) {
		let competitors = participants.filter(p => p.name !== "").map(p => new Person(p));
		this.competitors.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.competitors = competitors;
		this.Storage.set(this.Storage.registry, this.competitors);
		this.fire(this.Events.registryUpdated);
	}

	deleteCompetitor(id) {
		this.competitors = this.competitors.filter(c => c.competitionId !== id);
		this.Storage.set(this.Storage.registry, this.competitors);
		this.fire(this.Events.registryUpdated);
	}
}