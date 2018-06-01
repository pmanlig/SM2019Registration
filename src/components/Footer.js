import React from 'react';
import { InjectedClass, InjectedComponent, Components, Events } from '.';

export class Footers extends InjectedClass {
	messageId = 1;
	footers = [];

	constructor(injector) {
		super(injector);
		this.subscribe(Events.addFooter, (msg, type, timeout) => this.addFooter(msg, type, timeout));
	}

	addCustomFooter(content) {
		let myId = this.messageId++;
		this.footers = this.footers.concat([{
			id: myId,
			content: content
		}]);
		this.injector.fire(Events.footersChanged, myId);
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
		this.injector.fire(Events.footersChanged, myId);
	}

	deleteFooter(id) {
		this.footers = this.footers.filter(f => f.id !== id);
		this.injector.fire(Events.footersChanged, id);
	}
}

export class Footer extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.footersChanged, () => this.setState({}));
	}

	render() {
		return <div id="footer" className="footer">{this.inject(Components.Footers).footers.map(f => f.content)}</div>;
	}
}