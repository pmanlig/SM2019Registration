import * as Tabs from '.';

export class CompetitionTabs {
	static register = { name: "CompetitionTabs", createInstance: true };
	static wire = [];

	initialize() {
		this.tabs = [];
		for (const t in Tabs) {
			if ((typeof Tabs[t] === "function") && Tabs[t].tabInfo) {
				this.tabs.push(Tabs[t]);
			}
		}
		this.tabs = this.tabs.sort((a, b) => a.tabInfo.order - b.tabInfo.order);
	}
}