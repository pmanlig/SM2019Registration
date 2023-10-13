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
		for (const c in Cards) {
			if (Cards[c].disciplines && Cards[c].disciplines.includes(event.discipline) &&
				(competition.permissions >= Permissions.Admin ? Cards[c].editable : !Cards[c].editable)) {
				const Card = Cards[c];
				return <div>
					<p className="scorecard-header">{participant.name}</p>
					<Card  {...this.props} participant={participant} />
				</div>;
			}
		}
		return <div>
			<p className="scorecard-header">{participant.name}</p>
			<p>Grenen stöds inte</p>
		</div>;
	}
}