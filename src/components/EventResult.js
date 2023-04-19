import React from 'react';
import { Discipline } from '../models';
import { PointFieldScore, StdFieldScore } from '../logic';
import { FieldResult } from './FieldResult';

export class EventResult extends React.Component {
	render() {
		switch (this.props.event.discipline) {
			case Discipline.fieldP:
				return <FieldResult {...this.props} scorer={StdFieldScore}/>;
			case Discipline.scoredP:
				return <FieldResult {...this.props} scorer={PointFieldScore} />;
			default:
				return <div>Resultat är inte implementerat</div>;
		}
	}
}