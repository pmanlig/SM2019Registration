import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { EventResult } from '../components';

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["EventBus", "Events", "Competition", "Results"];

	constructor(props) {
		super(props);
		let { params } = this.props.match;
		this.state = { division: params.extra };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.updateTitle();
			this.setState({});
		});
		this.loadResults();
		this.subscribe(this.Events.resultsUpdated, this.updateResults);
		setInterval(this.loadResults, 60 * 1000);
	}

	loadResults = () => {
		let { params } = this.props.match;
		if (params.token !== undefined) {
			this.Results.load(params.id, params.token);
		}
	}

	updateResults = () => {
		let x = {};
		this.Results.scores.forEach(s => {
			if (x[s.division] === undefined) { x[s.division] = {}; }
			if (x[s.division][s.class] === undefined) { x[s.division][s.class] = []; }
			x[s.division][s.class].push(s);
		});
		this.setState({ scores: x, division: this.state.division || Object.keys(x).sort()[0] });
	}

	updateTitle() {
		let title = `Resultat för ${this.Competition.name}`;
		let event = this.Competition.event(parseInt(this.props.match.params.token, 10));
		if (event != null && event.name !== '') { title += ` / ${event.name}` }
		this.fire(this.Events.changeTitle, title);
	}

	componentDidMount() {
		this.updateTitle();
	}

	componentDidUpdate() {
		this.updateTitle();
		let { token } = this.props.match.params, { event } = this.Results;
		if ((token !== undefined && event === undefined) || token !== event.toString() || this.state.scores === undefined) {
			this.Results.load(this.props.match.params.id, this.props.match.params.token);
		}
	}

	eventClass(e) {
		return e.id === parseInt(this.props.match.params.token, 10) ? "button" : "button white";
	}

	updateEvent(event) {
		this.Results.load(this.Competition.id, event);
		// this.setState({ scores: undefined, division: undefined });
	}

	EventSelector = props => {
		if (this.Competition.events.length < 2) { return null; }
		return <div id="event-selector">
			{this.Competition.events.map(e =>
				<Link key={e.id} className={this.eventClass(e)} onClick={() => this.updateEvent(e.id)} to={`/competition/${this.Competition.id}/results/${e.id}`}>{e.name}</Link>)}
		</div>;
	}

	divisionClass(d) {
		return d === this.state.division ? "button" : "button white";
	}

	DivisionSelector = props => {
		let { scores } = this.state;
		if (scores == null || Object.keys(scores).length < 2) { return null; }
		return <div className="toolbar">
			{Object.keys(scores).sort().map(s =>
				<Link key={s} className={this.divisionClass(s)} onClick={() => this.setState({ division: s })} to={`/competition/${this.Competition.id}/results/${this.props.match.params.token}/${s}`}>{s}</Link>)}
		</div>;
	}

	render() {
		let { token } = this.props.match.params;
		if (token === undefined) {
			return <Redirect to={`/competition/${this.Competition.id}/results/${this.Competition.events[0].id}`} />;
		}

		if (this.state.scores === undefined) { return null; }
		let scores = Object.keys(this.state.scores[this.state.division]).map(k => this.state.scores[this.state.division][k]);

		return <div id="result" className="content">
			<this.EventSelector />
			<this.DivisionSelector />
			<EventResult competition={this.Competition} event={this.Competition.event(parseInt(token, 10))} results={scores} />
		</div>;
	}
}