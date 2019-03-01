import './Diagnostics.css';
import React from 'react';
import { Subject } from 'rxjs';
import { Schedule } from '../models';

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

	testCreateSchedule = () => {
		return new Promise(resolve => this.Server.createSchedule(new Schedule().toJson(), res => {
			this.testSchedule = Schedule.fromJson(res);
			resolve(true);
		}, e => {
			console.log(e);
			resolve(false);
		}));
	}

	testUpdateSchedule = () => {
		return new Promise(resolve => {
			this.testSchedule.addSquad("8:00", 10, ["C", "B", "A", "R"], true);
			this.Server.updateSchedule(this.testSchedule.toJson(), s => resolve(true), e => resolve(false))
		});
	}

	testDeleteSchedule = () => {
		return new Promise(resolve =>
			this.Server.deleteSchedule(this.testSchedule.id, s => resolve(true), e => resolve(false)));
	}

	testCreateCompetition = () => {
		return new Promise(resolve => this.Server.createCompetition({
			name: "__TestTävlingen__",
			description: "Automattest",
			status: 0,
			events: [{ name: "" }]
		},
			s => {
				this.competitionTestId = s.id;
				resolve(true);
			},
			e => {
				console.log(e.message);
				resolve(false);
			}));
	}

	testDeleteCompetition = () => {
		return new Promise(resolve => this.Server.deleteCompetition(this.competitionTestId, s => resolve(true), e => resolve(false)));
	}

	testLogout = () => {
		return new Promise(resolve => this.Server.logout(s => resolve(true), e => resolve(false)));
	}

	constructor(props) {
		super(props);
		this.bus = new Subject();
		this.tests = [
			{ test: this.testLogin, description: "Login" },
			{ test: this.testCreateCompetition, description: "Skapa tävling" },
			{ test: this.testDeleteCompetition, description: "Radera tävling" },
			{ test: this.testCreateSchedule, description: "Skapa startlista" },
			{ test: this.testUpdateSchedule, description: "Uppdatera startlista" },
			{ test: this.testDeleteSchedule, description: "Radera startlista" },
			{ test: this.testLogout, description: "Logout" }
		];
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