import React from 'react';

export class TestReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		props.bus.subscribe(({ test, result }) => { if (test === props.test) this.setState({ result: result }) });
	}

	className() {
		return this.state.result === undefined ? "running" : this.state.result ? "success" : "fail";
	}

	render() {
		return <div><div className={"testResult " + this.className()}>{this.className()}</div>{this.props.description}</div>
	}
}