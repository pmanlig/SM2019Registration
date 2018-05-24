import { Events, InjectedClass, setCookie, getCookie, deleteCookie } from '../logic';

export class Session extends InjectedClass {
	constructor(injector) {
		super(injector);
		this.user = getCookie("user", "");
	}

	login(user, password) {
		this.user = user;
		setCookie("user", this.user);
		this.fire(Events.userChanged);
	}

	logout() {
		this.user = "";
		deleteCookie("user");
		this.fire(Events.userChanged);
	}
}