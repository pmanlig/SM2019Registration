export class Configuration {
	static register = { name: "Configuration", createInstance: true };
	static wire = ["fire", "Events"];
	loaded = false;
	baseUrl = '';

	initialize() {
		console.log("fetching configuration");
		fetch("/config.json")
			.then(res => res.json())
			.then(json => {
				this.baseUrl = json.baseUrl;
				this.loaded = true;
				this.fire(this.Events.configurationLoaded);
			});
	}
}