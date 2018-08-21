import React from 'react';
import { Link, Redirect } from 'react-router-dom';

export class EventResult extends React.Component {
	static register = { name: "EventResult" };
	static wire = ["fire", "subscribe", "EventBus", "Events", "Competition", "Results"];

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

	series(event) {
		if (null === event) {
			return null;
		}
		let s = [];
		for (let i = 1; i <= event.series; i++) {
			s.push(<th key={i} className="round">{i}</th>);
		}
		return s;
	}

	participant(p) {
		let score = 1;
		return <tr key={p.id}>
			<td>{p.name}</td>
			<td>{p.organization}</td>
			{p.score.map(s => <td key={score++} className="score">{s.join("/")}</td>)}
			<td className="score">{p.total.join("/")}</td>
		</tr>;
	}

	render() {
		let event = this.getEvent(this.Competition);
		return <div id="results" className="content">
			<table>
				<thead>
					<tr>
						<th>Namn</th>
						<th style={{ paddingRight: "40px" }}>Förening</th>
						{this.series(event)}
						<th>Summa</th>
					</tr>
				</thead>
				<tbody>
					{this.Results.scores.map(s => this.participant(s))}
				</tbody>
			</table>
		</div>;
	}
}

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["fire", "subscribe", "EventBus", "Events", "EventResult", "Competition"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.fire(this.Events.changeTitle, "Resultat för " + this.Competition.name);
			this.setState({})
		});
	}

	componentWillMount() {
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