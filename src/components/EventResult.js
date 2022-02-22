import React from 'react';
import { Discipline } from '../models';
import { FieldResult } from './FieldResult';

export class EventResult extends React.Component {
	static register = { name: "EventResult" };
	static wire = ["EventBus", "Events", "Competition", "Results"];

	constructor(props) {
		super(props);
		this.EventBus.manageEvents(this);
		this.Results.load(props.match.params.id, this.props.match.params.token);
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

	render() {
		let event = this.getEvent(this.Competition);
		let res = null;
		switch (event.discipline) {
			case Discipline.fieldP:
				res = <FieldResult competition={this.Competition} event={event} results={this.Results}/>;
				break;
			default:
				res = <div>Resultat är inte implementerat</div>;
				break;
		}

		return <div id="result" className="content">
			{res}
		</div>;
	}
}