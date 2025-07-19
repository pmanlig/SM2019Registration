import './Scorecard.css';
import React from 'react';
import { Permissions } from '../models';
import * as Cards from './scorecards';

export class Scorecard extends React.Component {
	render() {
		let { competition, event, show, results } = this.props;
		results = results.flat();
		let participant = results.find(p => p.id === show);
		if (participant === undefined) { return null; }
		let EditCard = null;
		let ViewCard = null;
		for (const c in Cards) {
			if (Cards[c].disciplines && Cards[c].disciplines.includes(event.discipline)) {
				if (Cards[c].editable && competition.permissions >= Permissions.Admin) { EditCard = Cards[c]; }
				if (!Cards[c].editable) { ViewCard = Cards[c]; }
			}
		}
		const Card = EditCard ?? ViewCard;
		console.log("Scorecard", EditCard, ViewCard, Card);
		return Card ?
			<div>
				<p className="scorecard-header">{participant.name}</p>
				<Card  {...this.props} participant={participant} />
			</div> : <div>
				<p className="scorecard-header">{participant.name}</p>
				<p>Grenen stöds inte</p>
			</div>;
	}
}