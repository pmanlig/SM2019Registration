import React, { Component } from 'react';
import { AppInjector } from './AppInjector';

class CookieAlert extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: true };
	}

	hide(save) {
		let cookies = this.props.injector.inject("Cookies");
		cookies.storeCookies = save;
		cookies.setCookie(Cookies.storeCookies, save);
		this.setState({ visible: false });
	}

	render() {
		return this.state.visible && <div id="cookieAlert">
			<p className="centered">Vill du att information om anmälda skyttar sparas så att det blir lättare att anmäla nästa gång?</p>
			<input className="button cookieButton" type="button" value="Nej" onClick={() => this.hide(false)} />
			<input className="button cookieButton" type="button" value="Ja" onClick={() => this.hide(true)} />
		</div >;
	}
}

export class Cookies {
	static alert = "cookieAlert";
	static storeCookies = "storeCookies";
	static competitors = "competitors";
	static contact = "contact";
	static expires = "expires";
	static all = [Cookies.alert, Cookies.storeCookies, Cookies.contact, Cookies.competitors];

	constructor(injector) {
		this.injector = injector;
	}

	extractValue(cname, value) {
		if (value.trim().startsWith(cname + "=")) {
			this[cname] = value.split('=')[1];
		}
	}

	deleteCookie(c) {
		console.log("Deleting cookie " + c);
		document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}

	deleteCookies() {
		Cookies.all.forEach(c => this.deleteCookie(c));
	}

	unlimitedCookieExpiration() {
		let d = new Date();
		d.setFullYear(d.getFullYear() + 20);
		return Cookies.expires + "=" + d.toUTCString() + ';';
	}

	setCookie(name, value, expiration) {
		if (!expiration) {
			expiration = this.unlimitedCookieExpiration();
		}
		console.log("Setting cookie: " + name);
		document.cookie = name + '=' + value + ';' + expiration + '; path=/;';
	}

	async loadCookies(callback) {
		await decodeURIComponent(document.cookie).split(';').forEach(v => {
			Cookies.all.forEach(c => {
				this.extractValue(c, v);
			});
		});

		if (this.storeCookies === undefined) {
			this.injector.inject(AppInjector.Footers).addCustomFooter(<CookieAlert key="cookieAlert" injector={this.injector} />);
		}
		callback();
	}
}

