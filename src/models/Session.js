import { Events, InjectedClass } from '../logic';

export class Session extends InjectedClass {
	user = "";

	login(user, password) {
		this.user = user;
		this.fire(Events.userChanged);
	}

	logout() {
		this.user = "";
		this.fire(Events.userChanged);
	}
}