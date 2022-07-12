import * as Tabs from '.';

export function competitionTabs() {
	let tabs = [];
	for (const t in Tabs) {
		if ((typeof Tabs[t] === "function") && Tabs[t].tabInfo) {
			tabs.push(Tabs[t]);
		}
	}
	return tabs.sort((a, b) => a.tabInfo.order - b.tabInfo.order);
}