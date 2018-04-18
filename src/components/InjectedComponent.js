import React from 'react';

export class InjectedComponent extends React.Component {
	constructor(props) {
		super(props);
		this.inject = props.inject;
		this.subscribe = props.subscribe;
		this.fire = props.fire;
	}
}