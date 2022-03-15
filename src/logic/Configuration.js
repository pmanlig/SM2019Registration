import gpk from './../gpk_logo_wht.png';
// import xkretsen from './../gavleborg.png';
// import sm2022 from './../sm_2022.png';

export class Configuration {
	static register = { name: "Configuration", createInstance: true };
	static wire = ["fire", "Events"];
	loaded = false;
	baseUrl = '';
	site = '';
	mode = "computer";
	color = "white";
	background = "#222";
	icon = gpk;

	setMode(mode) {
		this.mode = mode;
		this.fire(this.Events.modeChanged, mode);
	}

	initialize() {
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