import { Events, setCookie, getCookie, deleteCookie } from '../logic';

export class Session {
	static register = { name: "Session", createInstance: true };
	static wire = ["fire", "Server", "Storage", "Footers"];

	constructor() {
		this.user = getCookie("user", "");
	}

	login(user, password) {
		this.Server.login(user, password, status => {
			this.user = user;
			setCookie("user", this.user);
			if (user === "patrik") this.Storage.set(this.Storage.keys.toggleServerMode, true);
			this.fire(Events.userChanged);
		}, this.Footers.errorHandler("Kan inte logga in"));
	}

	logout() {
		if (this.user !== "") {
			this.Server.logout(res => {
				this.user = "";
				deleteCookie("user");
				this.fire(Events.userChanged);
			}, this.Footers.errorHandler("Kan inte logga ut"));
		}
	}
}