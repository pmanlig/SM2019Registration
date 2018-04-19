import { InjectedClass, Cookies } from '../logic';
import { Components, Events, Person } from '.';

export class Registry extends InjectedClass {
	competitors = [];

	constructor(injector) {
		super(injector);
		this.subscription = this.subscribe(Events.cookiesLoaded, cookies => {
			if (cookies.competitors) {
				this.subscription.unsubscribe();
				this.competitors = JSON.parse(cookies.competitors);
				this.fire(Events.registryUpdated);
			}
		});
	}

	storeCompetitors(participants) {
		let competitors = participants.map(p => new Person(p));
		this.competitors.forEach(p => {
			if (competitors.find(e => e.competitionId === p.competitionId) === undefined)
				competitors.push(p);
		});
		this.competitors = competitors;
		this.inject(Components.Cookies).setCookie(Cookies.competitors, JSON.stringify(this.competitors));
		this.fire(Events.registryUpdated);
	}
}