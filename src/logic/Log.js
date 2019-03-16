export function logFetchCallback(c, msg) {
	if (!window._debug) { return c; }
	console.log(msg);
	return json => {
		console.log(json);
		c(json);
	}
}

export function logSendCallback(c, data, msg) {
	if (c === undefined) c = () => { };
	if (!window._debug) { return c; }
	console.log(msg);
	console.log(data);
	return json => {
		console.log(`Reply:`);
		console.log(json);
		c(json);
	}
}

export function logSendCallback2(c, data, msg) {
	if (c === undefined) c = () => { };
	if (!window._debug) { return c; }
	console.log(msg);
	console.log(data);
	return json => {
		console.log(`Reply (${msg}):`);
		console.log(json);
		c(json);
	}
}

export function logUpdateCallback(c, data, msg) {
	if (c === undefined) c = () => { };
	if (!window._debug) { return c; }
	console.log(msg);
	console.log(data);
	return c;
}

export function logErrorHandler(e) {
	if (e === undefined) e = () => { };
	if (!window._debug) { return e; }
	return txt => {
		if (typeof txt === 'object')
			console.log(`Error: ${JSON.stringify(txt)}`);
		else
			console.log(`Error: ${txt}`);
		e(txt);
	}
}

export function logUrl(url) {
	if (window._debug) {
		console.log(`URL: ${url}`);
	}
}