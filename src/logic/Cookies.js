import React, { Component } from 'react';
import { InjectedClass, Components, Events } from '.';

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
			<p className="centered">Vill du att information du matar in ska sparas så att det blir lättare att anmäla nästa gång?</p>
			<input className="button cookieButton" type="button" value="Nej" onClick={() => this.hide(false)} />
			<input className="button cookieButton" type="button" value="Ja" onClick={() => this.hide(true)} />
		</div >;
	}
}

export class Cookies extends InjectedClass {
	static alert = "cookieAlert";
	static storeCookies = "storeCookies";
	static competitors = "competitors";
	static contact = "contact";
	static expires = "expires";
	static all = [Cookies.alert, Cookies.storeCookies, Cookies.contact, Cookies.competitors];

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
		// ToDo: should prevent saving if save cookies = false
		if (!expiration) {
			expiration = this.unlimitedCookieExpiration();
		}
		console.log("Setting cookie: " + name);
		document.cookie = name + '=' + value + ';' + expiration + '; path=/;';
	}

	async loadCookies() {
		const myName = "Cookies";
		let busy = this.inject(Components.Busy);
		busy.setBusy(myName, true);

		await decodeURIComponent(document.cookie).split(';').forEach(v => {
			Cookies.all.forEach(c => {
				this.extractValue(c, v);
			});
		});

		if (this.storeCookies === undefined) {
			this.injector.inject(Components.Footers).addCustomFooter(<CookieAlert key="cookieAlert" injector={this.injector} />);
		}
		this.fire(Events.cookiesLoaded, this);
		busy.setBusy(myName, false);
	}
}

