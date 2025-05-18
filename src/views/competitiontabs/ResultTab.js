import './Result.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Permissions, ScoringModels, Status, TabInfo } from '../../models';
import { ParticipantResult, TeamResult, Scorecard } from '../../components';

export class ResultTab extends React.Component {
	static register = { name: "ResultTab" };
	static wire = ["Server", "EventBus", "Events", "Competition", "Results", "DivisionGroups"];
	static tabInfo = new TabInfo("Resultat", "results", 4, Permissions.Any, Status.Closed);

	constructor(props) {
		super(props);
		let { params } = this.props.match;
		this.state = { division: params.p2, filter: "" };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.updateTitle();
			this.loadTeams();
			this.setState({});
		});
		this.loadResults();
		this.subscribe(this.Events.resultsUpdated, this.updateResults);
	}

	loadResults = () => {
		let { params } = this.props.match;
		if (params.token !== undefined) {
			this.Results.load(params.id, params.token);
		}
	}

	updateResults = () => {
		this.setState({});
	}

	loadTeams = () => {
		let { id, p1 } = this.props.match.params;
		const callback = (json) => { this.setState({ teams: json }); }
		const error = () => { }
		this.Server.loadTeams(id, p1, callback, error);
	}

	updateTitle() {
		let title = `Resultat för ${this.Competition.name}`;
		let event = this.Competition.event(parseInt(this.props.match.params.p1, 10));
		if (event != null && event.name !== '') { title += ` / ${event.name}` }
		this.fire(this.Events.changeTitle, title);
	}

	componentDidMount() {
		this.updateTitle();
		this.interval = setInterval(this.loadResults, 5 * 60 * 1000);
	}

	componentDidUpdate() {
		this.updateTitle();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	eventClass(e) {
		return e.id === parseInt(this.props.match.params.p1, 10) ? "button" : "button white";
	}

	updateEvent(event) {
		this.Results.load(this.Competition.id, event);
	}

	divisionList(event) {
		if (event === undefined || event.divisions === undefined) { return []; }
		let divs = this.DivisionGroups.find(g => g.id === event.divisions);
		if (divs == null) return [];
		return divs.divisions.filter(d => !d.includes('+')).filter(d => !d.match(/^!/));
	}

	EventSelector = props => {
		if (this.Competition.events.length < 2) { return null; }
		return <div id="event-selector">
			{this.Competition.events.map(e =>
				<Link key={e.id} className={this.eventClass(e)} onClick={() => this.updateEvent(e.id)} to={`/competition/${this.Competition.id}/results/${e.id}`}>{e.name}</Link>)}
		</div>;
	}

	DivisionSelector = props => {
		let { event, active } = props;
		if (active === undefined) { return null; }
		return <div className="division-selector">
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
		return (event.divisions === undefined || division === undefined) ?
			this.separateScores(event, this.Results.scores) :
			this.separateScores(event, this.Results.scores.filter(s => s.division === division));
	}

	updateScorecard = () => {
		let { p1, p2, p3 } = this.props.match.params;
		let scorecard = parseInt(p2, 10) || parseInt(p3, 10);
		if (!isNaN(scorecard)) {
			let event = this.Competition.events.find(e => e.id === parseInt(p1, 10));
			let participant = this.Results.scores.find(s => s.id === scorecard);
			let model = ScoringModels.getModel(event.discipline);
			for (const score of participant.scores) {
				if (!model.validateScore(participant, event, score.stage)) {
					alert(`Station/serie ${score.stage} - ${participant.error}`);
					participant.error = undefined;
					return;
				}
			}
			this.Results.updateScore(parseInt(p1, 10), scorecard);
		}
	}

	render() {
		let { id, p1, p2, p3 } = this.props.match.params;
		let competition = this.Competition;

		if (id === undefined) { return <div>Fel - ingen tävling angiven!</div>; }
		if (competition.id !== id) {
			competition.load(id);
			return null;
		}

		if (p1 === undefined) {
			return <Redirect to={`/competition/${competition.id}/results/${competition.events[0].id}`} />;
		}

		p1 = parseInt(p1, 10);
		let event = competition.event(p1);
		if (this.Results.event !== event.id) {
			this.Results.load(id, p1);
			return null;
		}

		if (p2 === undefined) {
			if (event.divisions) {
				return <Redirect to={`/competition/${this.Competition.id}/results/${p1}/${this.divisionList(event)[0]}`} />;
			}
		}

		if (this.Results.scores === undefined) { return null; }

		let results = this.filterScores(event, p2);
		let scorecard = parseInt(p3, 10) || parseInt(p2, 10);
		if (!isNaN(scorecard)) {
			return <div id="result" className="content">
				<Scorecard competition={competition} event={event} show={scorecard} results={results} />
				<button className="globaltool" onClick={() => this.props.history.replace(`/competition/${id}/results/${p1}${p2 && isNaN(p2) ? `/${p2}` : ""}`)}>&lt; Tillbaka</button>
				{competition.permissions >= Permissions.Admin && <button className="globaltool" onClick={this.updateScorecard}>Spara</button>}
			</div>
		}

		return <div id="result" className="content">
			<div id="result-tools">
				<div id="result-filter">
					<p id="filter-label">Söktext</p>
					<input id="filter-input" value={this.state.filter} onChange={e => this.setState({ filter: e.target.value })} />
				</div>
				<this.EventSelector />
				<this.DivisionSelector event={event} active={p2} />
			</div>
			{ // Custom code for SM 2022
				parseInt(competition.id, 10) === 205 &&
				<p><i>Resultatlistorna är preliminära och resultat kan saknas för skyttar som ännu inte
					skjutit klart, de slutgiltiga resultatlistorna kommer att publiceras på SM-sidan.</i></p>}
			<ParticipantResult competition={competition} event={event} results={results} division={p2} filter={this.state.filter} />
			{/*<TeamResult competition={competition} event={event} results={results} division={p2} teams={this.state.teams} filter={this.state.filter} />*/}
		</div>;
	}
}