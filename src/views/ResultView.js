import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

let sum = (a, b) => a + b;
let tgt = x => x > 0;
let sort = (a, b) => {
	let pos = 0;
	while (pos < a.length && pos < b.length) {
		if (a[pos] === b[pos]) { pos++; }
		else { return a[pos] - b[pos]; }
	}
	return 0;
}

export class EventResult extends React.Component {
	static register = { name: "EventResult" };
	static wire = ["EventBus", "Events", "Competition", "Results"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.Results.load(props.match.params.id, this.props.match.params.token);
		this.fire(this.Events.changeTitle, "Resultat för " + this.Competition.name);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.fire(this.Events.changeTitle, "Resultat för " + this.Competition.name);
			this.setState({})
		});
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
	}

	getEvent(competition) {
		let event = null;
		competition.events.forEach(e => {
			if (String(e.id) === this.props.match.params.token) {
				event = e;
			}
		});
		return event;
	}

	Header = props => {
		let scores = [], s = 0;
		while (s++ < props.event.scores) { scores.push(<th key={s}>{s}</th>); }
		return <thead>
			<tr>
				<th>Plac</th>
				<th className="left">Namn</th>
				<th className="left">Förening</th>
				{scores}
				<th>Summa</th>
				{props.showValues && <th>Poäng</th>}
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, pos } = props;
		let { name, organization, scores, targets, total } = data;
		let txts = [];
		for (let i = 0; i < scores.length; i++) {
			txts[i] = <td key={i}>{`${scores[i]}/${targets[i]}`}</td>;
		}

		return <tr>
			<td>{pos}</td>
			<td className="left">{name}</td>
			<td className="left">{organization}</td>
			{txts}
			<td>{total[0]}/{total[1]}</td>
			{props.showValues && <td>{total[2]}p</td>}
		</tr>
	}

	render() {
		let event = this.getEvent(this.Competition);
		let showValues = event.stages.some(s => s.value);
		let stages = [];
		event.stages.forEach(s => stages[s.num] = s);
		let participants = this.Results.scores.map(p => {
			let scores = [], targets = [], value = 0;
			for (let i = 0; i < event.scores; i++) {
				scores[i] = 0;
				targets[i] = 0;
			}
			p.scores.forEach(s => {
				let score = [...s.values];
				if (stages[s.stage].value) { value += score.pop(); }
				scores[s.stage - 1] = score.reduce(sum);
				targets[s.stage - 1] = score.filter(tgt).length;
			});
			return {
				name: p.name,
				organization: p.organization,
				scores: scores,
				targets: targets,
				total: [scores.reduce(sum), targets.reduce(sum), value]
			}
		});
		participants.sort((a, b) => sort(a.total, b.total));
		let pos = 1;
		console.log("Displaying", event, participants);
		return <div id="result" className="content">
			<table>
				<this.Header event={event} showValues={showValues} />
				<tbody>
					{participants.map(p => <this.Participant key={p.id} pos={pos++} data={p} showValues={showValues} />)}
				</tbody>
			</table>
		</div>;
	}
}

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["EventBus", "Events", "EventResult", "Competition"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.fire(this.Events.changeTitle, "Resultat för " + this.Competition.name);
			this.setState({})
		});
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Resultat för " + this.Competition.name);
	}

	render() {
		if (this.props.match.params.token !== undefined) {
			return <this.EventResult {...this.props} />
		}

		if (this.Competition.events.length === 1) {
			return <Redirect to={`/competition/${this.Competition.id}/results/${this.Competition.events[0].id}`} />;
		}

		return <div className="content">
			<ul>
				{this.Competition.events.map(e => <li key={e.id}><Link to={`/competition/${this.Competition.id}/results/${e.id}`}>{e.name}</Link></li>)}
			</ul>
		</div>;
	}
}