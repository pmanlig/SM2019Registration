import { Events, setCookie, getCookie, deleteCookie } from '../logic';

export class Session {
	static register = { name: "Session", createInstance: true };
	static wire = ["fire", "Server"];

	constructor() {
		this.user = getCookie("user", "");
	}

	login(user, password) {
		this.Server.login(user, password, status => {
			this.user = user;
			setCookie("user", this.user);
			this.fire(Events.userChanged);
		});
	}

	logout() {
		if (this.user !== "") {
			this.Server.logout(res => {
				this.user = "";
				deleteCookie("user");
				this.fire(Events.userChanged);
			});
		}
	}
}