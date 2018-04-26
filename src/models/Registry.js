import { InjectedClass } from '../logic';
import { Components, Events, Person } from '.';

export class Registry extends InjectedClass {
	constructor(injector) {
		super(injector);
		this.competitors = injector.inject(Components.Storage).get("Registry") || [];
	}

	storeCompetitors(participants) {
		let competitors = participants.map(p => new Person(p));
		this.competitors.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.competitors = competitors;
		this.inject(Components.Storage).set("Registry", this.competitors);
		this.fire(Events.registryUpdated);
	}
}