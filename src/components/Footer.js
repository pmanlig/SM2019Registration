import React, { Component } from 'react';
import { Events } from '.';

export class Footers {
	messageId = 1;
	footers = [];

	constructor(injector) {
		this.injector = injector;
	}

	addCustomFooter(content) {
		let myId = this.messageId++;
		this.footers = this.footers.concat([{
			id: myId,
			content: content
		}]);
		this.injector.inject("EventBus").fire(Events.footersChanged, myId);
	}

	addFooter(msg, type = "error", timeout = 3000) {
		let myId = this.messageId++;
		let newFooter = { id: myId, content: <div key={myId} className={type}><p className="centered">{msg}</p></div> };
		this.footers = [newFooter].concat(this.footers);
		let timer = setTimeout(() => {
			this.deleteFooter(myId);
			clearTimeout(timer);
		}, timeout);
		this.injector.inject("EventBus").fire(Events.footersChanged, myId);
	}

	deleteFooter(id) {
		this.footers = this.footers.filter(f => f.id !== id);
		this.injector.inject("EventBus").fire(Events.footersChanged, id);
	}
}

export class Footer extends Component {
	componentDidMount() {
		this.subscription = this.props.injector.inject("EventBus").subscribe(Events.footersChanged, () => this.setState({}));
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return <div id="footer" className="footer">{this.props.injector.inject("Footers").footers.map(f => f.content)}</div>;
	}
}