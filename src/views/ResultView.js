import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { InjectedComponent, Components, Events } from '../logic';

class EventResult extends InjectedComponent {
	constructor(props) {
		super(props);
		this.inject(Components.Results).load(props.match.params.id, this.props.match.params.token);
		this.fire(Events.changeTitle, "Resultat för " + this.inject(Components.Competition).name);
		this.subscribe(Events.competitionUpdated, () => {
			this.fire(Events.changeTitle, "Resultat för " + this.inject(Components.Competition).name);
			this.setState({})
		});
		this.subscribe(Events.resultsUpdated, () => this.setState({}));
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
		let competition = this.inject(Components.Competition);
		let results = this.inject(Components.Results);
		let event = this.getEvent(competition);
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
					{results.scores.map(s => this.participant(s))}
				</tbody>
			</table>
		</div>;
	}
}

export class ResultView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.fire(Events.changeTitle, "Resultat för " + this.inject(Components.Competition).name);
		this.subscribe(Events.competitionUpdated, () => {
			this.fire(Events.changeTitle, "Resultat för " + this.inject(Components.Competition).name);
			this.setState({})
		});
	}

	render() {
		if (this.props.match.params.token !== undefined) {
			return <EventResult {...this.props} />
		}

		let competition = this.inject(Components.Competition);
		if (competition.events.length === 1) {
			return <Redirect to={"/competition/" + competition.id + "/results/" + competition.events[0].id} />;
		}

		return <div className="content">
			<ul>
				{competition.events.map(e => <li key={e.id}><Link to={"/competition/" + competition.id + "/results/" + e.id}>{e.name}</Link></li>)}
			</ul>
		</div>;
	}
}