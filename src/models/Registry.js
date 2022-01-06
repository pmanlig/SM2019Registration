import { Person } from '.';

export class Registry {
	static register = { name: "Registry", createInstance: true };
	static wire = ["fire", "Storage", "Events"];

	competitors = [];

	initialize() {
		// Patch old bug
		let old = this.Storage.get(this.Storage.registry);
		if (old) {
			this.Storage.deleteKey(this.Storage.registry);
			this.Storage.set(this.Storage.keys.registry, old);
		}
		this.competitors = this.Storage.get(this.Storage.keys.registry) || this.competitors;
	}

	storeCompetitors(participants) {
		let competitors = participants.filter(p => p.name !== "").map(p => new Person(p));
		this.competitors.forEach(p => {
			if (!competitors.some(e => e.competitionId === p.competitionId))
				competitors.push(p);
		});
		this.competitors = competitors;
		this.Storage.set(this.Storage.keys.registry, this.competitors);
		this.fire(this.Events.registryUpdated);
	}

	deleteCompetitor(id) {
		this.competitors = this.competitors.filter(c => c.competitionId !== id);
		this.Storage.set(this.Storage.registry, this.competitors);
		this.fire(this.Events.registryUpdated);
	}
}