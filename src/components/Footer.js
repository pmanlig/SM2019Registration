import React from 'react';
import { Events } from '.';

// ToDo: apply withEvents
export class Footers {
	static register = { createInstance: true };
	static inject = ["fire", "subscribe"];

	messageId = 1;
	footers = [];

	initialize() {
		this.subscribe(Events.addFooter, (msg, type, timeout) => this.addFooter(msg, type, timeout));
	}

	addCustomFooter(content) {
		let myId = this.messageId++;
		this.footers = this.footers.concat([{
			id: myId,
			content: content
		}]);
		this.fire(Events.footersChanged, myId);
	}

	addFooter(msg, type = "error", timeout = 3000) {
		if (this.footers.filter(f => f.msg === msg).length > 0) { return; }
		let myId = this.messageId++;
		let newFooter = { id: myId, msg: msg, content: <div key={myId} className={type}><p className="centered">{msg}</p></div> };
		this.footers = [newFooter].concat(this.footers);
		let timer = setTimeout(() => {
			this.deleteFooter(myId);
			clearTimeout(timer);
		}, timeout);
		this.fire(Events.footersChanged, myId);
	}

	deleteFooter(id) {
		this.footers = this.footers.filter(f => f.id !== id);
		this.fire(Events.footersChanged, id);
	}
}

export class Footer extends React.Component {
	static register = true;
	static inject = ["Footers", "subscribe"];

	constructor(props) {
		super(props);
		this.subscribe(Events.footersChanged, () => this.setState({}));
	}

	render() {
		return <div id="footer" className="footer">{this.Footers.footers.map(f => f.content)}</div>;
	}
}