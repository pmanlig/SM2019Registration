import './Diagnostics.css';
import React from 'react';
import { Subject } from 'rxjs';
import { CompetitionTests, ScheduleTests, DivisionsTests, ClassesTests } from '../test';

class TestReport extends React.Component {
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

export class Diagnostics extends React.Component {
	static register = { name: "Diagnostics" };
	static wire = ["Server"];

	runTests = (tests) => {
		if (!tests) {
			this.runTests(this.tests.concat([]));
			return;
		}
		let t = tests.shift();
		t.test().then(v => {
			this.bus.next({ test: t.test, result: v });
			this.runTests(tests);
		});
	}

	testLogin = () => {
		return new Promise(resolve => this.Server.login("patrik", "pangpang", s => resolve(true), e => resolve(false)));
	}

	testLogout = () => {
		return new Promise(resolve => this.Server.logout(s => resolve(true), e => resolve(false)));
	}

	constructor(props) {
		super(props);
		this.bus = new Subject();
		this.tests = [{ test: this.testLogin, description: "Login" }]
			.concat(
				new ClassesTests().tests(),
				new DivisionsTests().tests(),
				new CompetitionTests().tests(),
				new ScheduleTests().tests(),
				[{ test: this.testLogout, description: "Logout" }]);

		window.setTimeout(this.runTests, 10);
	}

	render() {
		let i = 1;
		return <div className="content">
			<h1>Diagnostics</h1>
			{this.tests.map(t => <TestReport key={i++} test={t.test} bus={this.bus} description={t.description} />)}
		</div>;
	}
}