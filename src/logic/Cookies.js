import { startsWith } from '.';

export function setCookie(name, value, expiration) {
	document.cookie = `${name}=${value}` + (expiration ? "; " + expiration : "") + "; path=/";
}

export function getCookie(name, defaultValue = null) {
	let d = decodeURIComponent(document.cookie)
		.split(";")
		.filter(c => startsWith(c.trim(), name + "="))
		.map(c => c.split("=")[1]);
	if (d.length === 0)
		return defaultValue;
	return d[0];
}

export function deleteCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
}
