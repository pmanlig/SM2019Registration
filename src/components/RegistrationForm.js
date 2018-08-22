import './Registration.css';
import React from 'react';
import { RegistrationRow } from './RegistrationRow';

export class RegistrationForm extends React.Component {
	static register = { name: "RegistrationForm" };
	static wire = ["Competition", "Registration"];

	addButtonHeader(minorHeaders) {
		minorHeaders.push(<th key={minorHeaders.length} className="minor entry" style={{ width: "20px" }}>&nbsp;</th>);
	}

	addMinorHeadersFor(event, useEventName, minorHeaders) {
		let initial = minorHeaders.length;
		console.log(event);
		if (event.classes && this.Competition.classes(event.classes)) { // Hack to handle nonexisting classGroups
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry">Klass</th>);
		}
		if (event.divisions && this.Competition.divisions(event.divisions)) { // Hack to handle nonexisting classGroups
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry">Vapengrupp</th>);
		}
		if (event.schedule) {
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry">Starttid</th>);
		}
		if (event.maxRegistrations > 1) {
			this.addButtonHeader(minorHeaders);
		}

		if (initial === minorHeaders.length) {
			if (useEventName) { minorHeaders.push(<th key={minorHeaders.length} className="minor entry vert"><div>{event.name.replace(/ /g, "\u00a0")}</div></th>); }
			else { minorHeaders.push(<th key={minorHeaders.length} className="minor entry"><div></div></th>); }

		}
	}

	addHeadersFor(eventList, majorTitle, majorHeaders, minorHeaders) {
		let initial = minorHeaders.length;
		eventList.forEach(e => this.addMinorHeadersFor(e, true, minorHeaders));
		majorHeaders.push(<th key={majorTitle} className="major" colSpan={minorHeaders.length - initial}>{majorTitle}</th>);
	}

	addEventHeadersFor(eventList, majorHeaders, minorHeaders) {
		eventList.forEach(e => {
			let initial = minorHeaders.length;
			this.addMinorHeadersFor(e, false, minorHeaders)
			majorHeaders.push(<th key={e.id} className="major" colSpan={minorHeaders.length - initial}>{e.name.replace(/ /g, "\u00a0")}</th>);
		});
	}

	RegistrationHeader = props => {
		let participantHeader = this.Competition.participantHeader();
		const majorHeaders = [<th key="-1" className="major" colSpan={participantHeader.subFields.length}>{participantHeader.name}</th>];
		const minorHeaders = [];

		participantHeader.subFields.forEach(s => {
			minorHeaders.push(<th key={minorHeaders.length} style={{ width: s.width, paddingRight: 10, verticalAlign: "bottom" }} className="minor">{s.name}</th>);
		});

		if (this.Competition.eventGroups.length > 0) {
			this.Competition.eventGroups.forEach(group => { this.addHeadersFor(this.Competition.eventList(group.id), group.name, majorHeaders, minorHeaders); });
		} else {
			this.addEventHeadersFor(this.Competition.events, majorHeaders, minorHeaders);
		}

		/*
		majorHeaders.push(<th key="-1" className="major">&nbsp;</th>);
		this.addButtonHeader(minorHeaders);
		*/

		return (
			<thead>
				<tr>{majorHeaders}</tr>
				<tr>{minorHeaders}</tr>
			</thead>
		);
	}

	RegistrationRows = props => {
		return <tbody>{this.Registration.participants.map(
			p => <RegistrationRow key={p.id} participant={p} {...props} />
		)}</tbody>;
	}

	render() {
		return <div id='registration' className='content'>
			<table>
				<this.RegistrationHeader />
				<this.RegistrationRows />
			</table>
		</div>;
	}
}