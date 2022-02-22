import React from 'react';
import { Discipline } from '../models';
import { FieldResult } from './FieldResult';

export class EventResult extends React.Component {
	render() {
		switch (this.props.event.discipline) {
			case Discipline.fieldP:
				return <FieldResult {...this.props} />;
			default:
				return <div>Resultat är inte implementerat</div>;
		}
	}
}