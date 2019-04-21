export class Configuration {
	static register = { name: "Configuration", createInstance: true };
	static wire = ["fire", "Events"];
	loaded = false;
	baseUrl = '';
	site = '';

	initialize() {
		console.log("Fetching configuration");
		fetch("/config.json")
			.then(res => res.json())
			.then(json => {
				this.baseUrl = json.baseUrl;
				this.site = json.site || 'production';
				this.loaded = true;
				window._debug = this.site !== 'production';
				this.fire(this.Events.configurationLoaded);
			});
	}
}