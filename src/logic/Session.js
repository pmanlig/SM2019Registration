import { Events, setCookie, getCookie, deleteCookie } from '.';

export class Session {
	static register = { name: "Session", createInstance: true };
	static wire = ["fire", "subscribe", "Server", "Configuration", "Storage", "Footers"];
	static E_LOGIN_ERROR = "Kan inte logga in";
	static E_LOGOUT_ERROR = "Kan inte logga ut";
	static KEEPALIVE_INTERVAL = 1000 * 60 * 15;

	initialize() {
		this.subscribe(Events.configurationLoaded, this.checkLogin);
	}

	checkLogin = () => {
		this.user = getCookie("user", "");
		if (this.user && this.user !== "") {
			this.login_token = getCookie("login_token");
			this.keepAliveTimer = setInterval(this.keepAlive, Session.KEEPALIVE_INTERVAL);
			this.keepAlive();
		}
	}

	keepAlive = () => {
		let errorHandler = error => {
			console.log("Error contacting server", error);
			this.user = "";
			deleteCookie("user");
			this.login_token = "";
			deleteCookie("login_token");
			if (this.keepAliveTimer !== undefined) {
				clearInterval(this.keepAliveTimer);
				this.keepAliveTimer = undefined;
			}
			this.fire(Events.userChanged);
		}
		fetch(`${this.Configuration.baseUrl}/keepalive`, {
			crossDomain: true,
			credentials: 'include',
			method: "POST",
			body: JSON.stringify({ login_token: this.login_token })
		})
			.then(res => {
				if (!res.ok) { errorHandler(res); } else
					res.json()
						.then(json => {
							console.log("Kept alive");
							this.login_token = json.login_token;
							setCookie("login_token", json.login_token);
						})
						.catch(errorHandler);
			})
			.catch(errorHandler);
	}

	login(user, password) {
		this.Server.login(user, password, status => {
			this.user = user;
			setCookie("user", this.user);
			if (user === "patrik") this.Storage.set(this.Storage.keys.toggleServerMode, true);
			this.keepAliveTimer = setInterval(this.keepAlive, Session.KEEPALIVE_INTERVAL);
			this.fire(Events.userChanged);
			this.keepAlive();
		}, this.Footers.errorHandler(Session.E_LOGIN_ERROR));
	}

	logout() {
		if (this.user !== "") {
			this.Server.logout(res => {
				this.user = "";
				deleteCookie("user");
				deleteCookie("login_token");
				if (this.keepAliveTimer) {
					clearInterval(this.keepAliveTimer);
					this.keepAliveTimer = undefined;
				}
				this.fire(Events.userChanged);
			}, this.Footers.errorHandler(Session.E_LOGOUT_ERROR));
		}
	}
}