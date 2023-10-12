import React from 'react';
import * as ResultLists from './resultlists';

export class EventResult extends React.Component {
	render() {
		for (const rl in ResultLists) {
			let List = ResultLists[rl];
			if (List.disciplines && List.disciplines.includes(this.props.event.discipline)) {
				return <List {...this.props} />
			}
		}
		return <div>Resultat är inte implementerat</div>;
	}
}