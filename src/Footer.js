import React from 'react';

var messageId = 1;

export function Footer(props) {
	return <div id="footer" className="footer">{props.footers}</div>;
}

export function deleteFooter(injector, id) {
	injector.app.setState({ footers: injector.app.state.footers.filter(f => f.id !== id) });
}

export function addFooter(injector, msg, type = "error", timeout = 3000) {
	let myId = messageId++;
	let newFooter = { id: myId, content: <div key={myId} className={type}><p className="centered">{msg}</p></div> };
	injector.app.setState({ footers: [newFooter].concat(injector.app.state.footers) });
	let timer = setTimeout(() => {
		deleteFooter(injector, myId);
		clearTimeout(timer);
	}, timeout);
}

export function registerFooter(injector) {
	injector.state = { footers: [], ...injector.state };
	injector.register("Footer", (props) => Footer({ footers: injector.app.state.footers.map(f => f.content), ...props }));
	injector.register("addFooter", (msg, type, timeout) => addFooter(injector, msg, type));
	injector.register("deleteFooter", (id) => deleteFooter(injector, id));
	injector.register("addFooter2", () => { });
}
