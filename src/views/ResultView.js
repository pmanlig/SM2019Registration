import './ResultView.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

export class ResultView extends React.Component {
	static register = { name: "ResultView" };
	static wire = ["EventBus", "Events", "EventResult", "FieldResult", "Competition"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.subscribe(this.Events.competitionUpdated, () => {
			this.updateTitle();
			this.setState({})
		});
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