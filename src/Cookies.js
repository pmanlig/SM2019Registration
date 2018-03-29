import React from 'react';

const COOKIE_ALERT = "cookieAlert";
// const COOKIE_COMPETITORS = "competitors";
const COOKIE_EXPIRES = "expires";

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

export async function loadCookies(callback) {
	var result = {};
	await decodeURIComponent(document.cookie).split(';').forEach(c => {
		extractValue(COOKIE_ALERT, c, result);
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
	return <div id="cookieAlert" className="footer" onClick={props.onClick}>
		<p className="centered">Sidan sparar information i cookies på din dator för att underlätta framtida anmälningar.</p>
	</div >;
}
