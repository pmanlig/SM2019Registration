import { InjectedClass, Components } from "../logic";

export class Results extends InjectedClass {
	load(competitionId) {
		this.inject(Components.Server).loadResults(competitionId, undefined, json => {

		});
		console.log("Loading results");
	}
}