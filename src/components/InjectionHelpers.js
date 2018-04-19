import React from 'react';

export class InjectedComponent extends React.Component {
	constructor(props) {
		super(props);
		this.inject = props.inject;
		this.subscribe = props.subscribe;
		this.fire = props.fire;
	}
}

export class InjectedClass {
	constructor(injector) {
		this.injector = injector;
		this.inject = injector.inject;
		this.subscribe = injector.subscribe;
		this.fire = injector.fire;
	}
}