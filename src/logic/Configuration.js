import gpk from './../gpk_logo_wht.png';
import { Mode } from '../models';

export class Configuration {
	static register = { name: "Configuration", createInstance: true };
	static wire = ["fire", "Events", "Storage"];

	loaded = false;
	baseUrl = '';
	site = '';
	mode = "computer";
	color = "white";
	background = "#222";
	icon = gpk;

	setMode(mode) {
		this.mode = mode;
		this.Storage.set(this.Storage.keys.programMode, mode);
		this.fire(this.Events.modeChanged, mode);
	}

	initialize() {
		this.mode = this.Storage.get(this.Storage.keys.programMode) || Mode.computer;
		fetch("/config.json")
			.then(res => res.json())
			.then(json => {
				if (json.useSite) {
					this.site = json.useSite || 'real';
					this.baseUrl = (this.site === 'test' ? json.baseUrlTest : json.baseUrlReal) || json.baseUrl;
				} else {
					console.log("Setting baseUrl", json.baseUrl);
					this.baseUrl = json.baseUrl;
				}
				this.loaded = true;
				window._debug = this.site !== 'real';
				this.fire(this.Events.configurationLoaded);
			});
	}
}