import './Results.css';
import React from 'react';
import * as ResultLists from './resultlists';
import * as TeamLists from './teamresults';

export function ParticipantResult(props) {
	for (const rl in ResultLists) {
		let List = ResultLists[rl];
		if (List.disciplines && List.disciplines.includes(props.event.discipline)) {
			return <List {...props} />
		}
	}
	return <div>Resultat är inte implementerat för tävlingsformen</div>;
}

export function TeamResult(props) {
	if (props.teams === undefined) { return null; }
	for (const tl in TeamLists) {
		let List = TeamLists[tl];
		if (List.disciplines && List.disciplines.includes(props.event.discipline)) {
			return <List {...props} />
		}
	}
	return <div>Resultat är inte implementerat för tävlingsformen</div>;
}