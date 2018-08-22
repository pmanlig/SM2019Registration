import { Person } from '.';

export class Registry {
	static register = { name: "Registry", createInstance: true };
	static wire = ["fire", "Storage", "Events"];

	initialize() {
		this.competitors = this.Storage.get(this.Storage.registry) || [];
		this.competitors = [];
	}

	storeCompetitors(participants) {
		let competitors = participants.map(p => new Person(p));
		this.competitors.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.competitors = competitors;
		this.Storage.set(this.Storage.registry, this.competitors);
		this.fire(this.Events.registryUpdated);
	}
}