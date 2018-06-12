import { InjectedClass, Components, Events } from "../logic";

export class Results extends InjectedClass {
	competition = undefined;
	scores = [];

	constructor(injector) {
		super(injector);
		this.competition = this.inject(Components.Competition);
	}

	load(competitionId) {
		this.inject(Components.Server).loadResults(competitionId, undefined, json => {
			this.scores = json;
			this.fire(Events.resultsUpdated);
		});
	}
}