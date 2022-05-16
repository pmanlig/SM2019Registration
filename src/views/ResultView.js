import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { EventResult } from '../components';

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["EventBus", "Events", "Competition", "Results", "DivisionGroups"];

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
		setInterval(this.loadResults, 5 * 60 * 1000);
	}

	loadResults = () => {
		console.log("Refreshing results");
		let { params } = this.props.match;
		if (params.token !== undefined) {
			this.Results.load(params.id, params.token);
		}
	}

	updateResults = () => {
		this.setState({});
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
	}

	divisionList(event) {
		if (event === undefined) { return []; }
		return this.DivisionGroups.find(g => g.id === event.divisions).divisions.filter(d => !d.includes('+')).filter(d => !d.match(/^!/));
	}

	EventSelector = props => {
		console.log(this.Competition.events[0]);
		if (this.Competition.events.length < 2) { return null; }
		return <div id="event-selector">
			{this.Competition.events.map(e =>
				<Link key={e.id} className={this.eventClass(e)} onClick={() => this.updateEvent(e.id)} to={`/competition/${this.Competition.id}/results/${e.id}`}>{e.name}</Link>)}
		</div>;
	}

	DivisionSelector = props => {
		let { event, active } = props;
		if (active === undefined) { return null; }
		return <div className="toolbar">
			{this.divisionList(event).sort().map(d =>
				<Link key={d} className={d === active ? "button" : "button white"} to={`/competition/${this.Competition.id}/results/${event.id}/${d}`}>{d}</Link>)}
		</div>;
	}

	separateScores(event, scores) {
		if (event.classes === undefined) { return [scores]; }
		let result = {};
		scores.forEach(s => {
			if (result[s.class] === undefined) { result[s.class] = []; }
			result[s.class].push(s);
		});
		return Object.keys(result).map(k => result[k]);
	}

	filterScores(event, division) {
		if (event.divisions === undefined || division === undefined) { return this.separateScores(event, this.Results.scores); }
		return this.separateScores(event, this.Results.scores.filter(s => s.division === division));
	}

	render() {
		let { token, extra } = this.props.match.params;
		if (token === undefined) {
			return <Redirect to={`/competition/${this.Competition.id}/results/${this.Competition.events[0].id}`} />;
		}
		let event = this.Competition.events.find(e => e.id === parseInt(token, 10));
		if (extra === undefined) {
			if (event.divisions) {
				return <Redirect to={`/competition/${this.Competition.id}/results/${token}/${this.divisionList(event)[0]}`} />;
			}
		}
		if (this.Results.scores === undefined) { return null; }

		return <div id="result" className="content">
			<this.EventSelector />
			<this.DivisionSelector event={event} active={extra} />
			<EventResult competition={this.Competition} event={this.Competition.event(parseInt(token, 10))} results={this.filterScores(event, extra)} />
		</div>;
	}
}