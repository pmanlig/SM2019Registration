import './Scorecard.css';
import React from 'react';
import { Discipline } from '../models';
import { FieldScorecard } from './FieldScorecard';
import { EditFieldScorecard } from './EditFieldScorecard';
import { Permissions } from '../models';

export class Scorecard extends React.Component {
	render() {
		let { competition, event, show, results } = this.props;
		results = results.flat();
		let participant = results.find(p => p.id === show);
		if (participant === undefined) { return null; }
		return <div>
			<p className="scorecard-header">{participant.name}</p>
			{event.discipline === Discipline.fieldP && (competition.permissions >= Permissions.Admin ?
				<EditFieldScorecard {...this.props} participant={participant} /> :
				<FieldScorecard {...this.props} participant={participant} />)}
		</div>;
	}
}