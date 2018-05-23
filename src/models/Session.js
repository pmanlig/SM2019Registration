import { Events, InjectedClass } from '../logic';

export class Session extends InjectedClass {
	user = "";

	constructor(injector) {
		super(injector);
		let c = decodeURIComponent(document.cookie);
		c.split(";").forEach(u => {
			if (u.trim().startsWith("user=")) {
				this.user = u.split("=")[1];
			}
		});
	}

	login(user, password) {
		this.user = user;
		document.cookie = "user=" + user + "; path=/";
		this.fire(Events.userChanged);
	}

	logout() {
		this.user = "";
		document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
		this.fire(Events.userChanged);
	}
}