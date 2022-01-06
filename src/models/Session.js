import { Events, setCookie, getCookie, deleteCookie } from '../logic';

export class Session {
	static register = { name: "Session", createInstance: true };
	static wire = ["fire", "Server", "Configuration", "Storage", "Footers"];
	static E_LOGIN_ERROR = "Kan inte logga in";
	static E_LOGOUT_ERROR = "Kan inte logga ut";

	initialize() {
		this.user = getCookie("user", "");
		if (this.user && this.user !== "") {
			this.keepAliveTimer = setInterval(this.keepAlive, 1000 * 60 * 60);
		}
	}

	keepAlive = () => {
		fetch(`${this.Configuration.baseUrl}/competition`, {
			crossDomain: true,
			credentials: 'include',
		})
			.then(res => {
				if (!res.ok) { console.log("Server reported error", res); } else
					res.json()
						.then(json => {
							// Keep alive
							console.log("Keep alive", json);
						})
						.catch(error => { console.log("Error contacting server", error); });
			});
	}

	login(user, password) {
		this.Server.login(user, password, status => {
			this.user = user;
			setCookie("user", this.user);
			if (user === "patrik") this.Storage.set(this.Storage.keys.toggleServerMode, true);
			this.keepAliveTimer = setInterval(this.keepAlive, 1000 * 60 * 60);
			this.fire(Events.userChanged);
		}, this.Footers.errorHandler(Session.E_LOGIN_ERROR));
	}

	logout() {
		if (this.user !== "") {
			this.Server.logout(res => {
				this.user = "";
				deleteCookie("user");
				if (this.keepAliveTimer) { clearInterval(this.keepAliveTimer); }
				this.fire(Events.userChanged);
			}, this.Footers.errorHandler(Session.E_LOGOUT_ERROR));
		}
	}
}