import React from 'react';

export const COOKIE_ALERT = "cookieAlert";
export const COOKIE_COMPETITORS = "competitors";
export const COOKIE_EXPIRES = "expires";

function extractValue(cname, value, result) {
	if (value.trim().startsWith(cname + "=")) {
		result[cname] = value.split('=')[1];
	}
}

function unlimitedCookieExpiration() {
	let d = new Date();
	d.setFullYear(d.getFullYear() + 20);
	return COOKIE_EXPIRES + "=" + d.toUTCString() + ';';
}

export function deleteCookie(c) {
	document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function deleteCookies() {
	[COOKIE_ALERT, COOKIE_COMPETITORS].forEach(c => deleteCookie(c));
}

export async function loadCookies(callback) {
	var result = {};
	await decodeURIComponent(document.cookie).split(';').forEach(c => {
		extractValue(COOKIE_ALERT, c, result);
		extractValue(COOKIE_COMPETITORS, c, result);
	});
	callback(result);
}

export function setCookie(name, value, expiration) {
	if (!expiration) {
		expiration = unlimitedCookieExpiration();
	}
	document.cookie = name + '=' + value + ';' + expiration;
}

export function CookieAlert(props) {
	return <div id="cookieAlert">
		<p className="centered">Vill du att information om anmälda skyttar sparas så att det blir lättare att anmäla nästa gång?</p>
		<input className="button cookieButton" type="button" value="Nej" onClick={props.onClick} />
		<input className="button cookieButton" type="button" value="Ja" onClick={props.onClick} />
	</div >;
}
