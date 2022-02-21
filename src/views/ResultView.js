import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

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
			</tr>
		</thead>;
	}

	Participant = props => {
		let { data, event, pos } = props;
		let { name, organization } = data;
		let scores = [], s = 0;
		while (s++ < event.scores) { scores.push(<td key={s}></td>); }
		data.scores.forEach(sc => {
			scores[sc.stage - 1] = <td key={sc.stage}>{sc.values}</td>
		});
		return <tr>
			<td>{pos}</td>
			<td className="left">{name}</td>
			<td className="left">{organization}</td>
			{scores}
			<td>Summa</td>
		</tr>
	}

	render() {
		let event = this.getEvent(this.Competition);
		let participants = this.Results.scores;
		// Calculate sums & sort participants
		let pos = 1;
		console.log("Displaying", event, participants);
		return <div id="result" className="content">
			<table>
				<this.Header event={event} />
				<tbody>
					{participants.map(p => <this.Participant key={p.id} pos={pos++} data={p} event={event} />)}
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