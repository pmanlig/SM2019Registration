import React from 'react';
import { Link, Redirect } from 'react-router-dom';

let sum = (a, b) => a + b;
let tgt = x => x > 0;
let sort = (a, b) => {
	let pos = 0;
	while (pos < a.length && pos < b.length) {
		if (a[pos] === b[pos]) { pos++; }
		else { return b[pos] - a[pos]; }
	}
	return 0;
}

export class TiebreakerView extends React.Component {
	static register = { name: "TiebreakerView" };
	static wire = ["Events", "EventBus", "Competition", "Results"];

	constructor(props) {
		super(props);
		let { p2 } = this.props.match.params;
		this.state = { division: p2, filter: "" };
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.updateTitle();
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
		return e.id === parseInt(this.props.match.params.token, 10) ? "button" : "button white";
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
			for (const score of participant.scores) {
				let stageDef = event.stages.find(s => s.num === score.stage);
				if (!participant.validateScore(stageDef)) {
					alert(`Station ${score.stage} - ${participant.error}`);
					participant.error = undefined;
					return;
				}
			}
			this.Results.updateScore(parseInt(p1, 10), scorecard);
		}
	}

	calculateScores(event, results) {
		let stages = [];
		event.stages.forEach(s => stages[s.num] = s);
		let participants = results.map(p => {
			let scores = [], targets = [], value = 0;
			for (let i = 0; i < event.scores; i++) {
				scores[i] = 0;
				targets[i] = 0;
			}
			p.scores.forEach(s => {
				if (s.stage <= event.scores) {
					let score = [...s.values];
					if (stages[s.stage].value) { value += score.pop(); }
					scores[s.stage - 1] = score.reduce(sum);
					targets[s.stage - 1] = score.filter(tgt).length;
				}
			});
			return {
				id: p.id,
				name: p.name,
				organization: p.organization,
				scores: scores,
				targets: targets,
				class: p.class,
				total: [scores.reduce(sum), targets.reduce(sum), value]
			}
		});
		return participants.sort((a, b) => sort(a.total, b.total));
	}

	render() {
		let { id, eventId } = this.props.match.params;

		if (id === undefined) { return <div>Fel - ingen tävling angiven!</div>; }
		if (this.Competition.id !== id) {
			this.Competition.load(id);
			return null;
		}

		if (eventId === undefined) {
			return <Redirect to={`/tiebreaker/${this.Competition.id}/${this.Competition.events[0].id}`} />;
		}

		eventId = parseInt(eventId, 10);
		let event = this.Competition.events.find(e => e.id === eventId);
		if (this.Results.event !== event.id) {
			this.Results.load(id, eventId);
			return null;
		}

		if (this.Results.scores === undefined) { return null; }

		let results = this.filterScores(event);
		results = this.calculateScores(event, this.Results.scores);
		let ties = [], i = 0;
		while (i < 3) {
			console.log("compare", results[i].total[0], results[i + 1].total[0]);
			if (results[i].total[0] === results[i + 1].total[0]) {
				ties.push(results[i++]);
				while (results[i].total[0] === results[i - 1].total[0]) { ties.push(results[i++]); }
			} else {
				i++;
			}
		}

		console.log(ties);

		return <div id="result" className="content">
			<this.EventSelector />
			{ties.map(p => <p key={p.id}>{p.name} {p.total[0]}</p>)}
		</div>;
	}
}