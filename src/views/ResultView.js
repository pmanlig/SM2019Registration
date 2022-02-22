import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { EventResult } from '../components';

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["EventBus", "Events", "Competition", "Results"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.Results.load(props.match.params.id, this.props.match.params.token);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.updateTitle();
			this.setState({})
		});
		this.subscribe(this.Events.resultsUpdated, () => this.setState({}));
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
		if (this.props.match.params.token !== this.Results.event) {
			this.Results.load(this.props.match.params.id, this.props.match.params.token);
		}
	}

	EventSelector = props => {
		let cls = e => e.id === parseInt(this.props.match.params.token, 10) ? "button" : "button white";
		if (this.Competition.events.length < 2) { return null; }
		return <div id="event-selector">
			{this.Competition.events.map(e => <Link key={e.id} to={`/competition/${this.Competition.id}/results/${e.id}`} className={cls(e)}>{e.name}</Link>)}
		</div>;
	}

	render() {
		if (this.props.match.params.token === undefined) {
			return <Redirect to={`/competition/${this.Competition.id}/results/${this.Competition.events[0].id}`} />;
		}

		return <div className="content">
			<this.EventSelector />
			<EventResult competition={this.Competition} event={this.Competition.event(parseInt(this.props.match.params.token, 10))} results={this.Results} />
		</div>;
	}
}