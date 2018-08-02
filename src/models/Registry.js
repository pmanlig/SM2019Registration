import { Events, Person } from '.';

export class Registry {
	static register = { createInstance: true };
	static wire = ["fire", "Storage"];

	initialize() {
		this.Storage.registerKey(Registry.name);
		this.competitors = this.Storage.get(Registry.name) || [];
	}

	storeCompetitors(participants) {
		let competitors = participants.map(p => new Person(p));
		this.competitors.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.competitors = competitors;
		this.Storage.set(Registry.name, this.competitors);
		this.fire(Events.registryUpdated);
	}
}