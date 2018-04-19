import { InjectedClass } from '../components';
import { Person } from '.';

export class Registry extends InjectedClass {
	registry = [];
	
	storeCompetitors(participants) {
		let competitors = participants.map(p => new Person(p));
		this.registry.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.registry = competitors;
	}
}