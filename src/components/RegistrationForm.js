import './Registration.css';
import React from 'react';
import { RegistrationRow } from './RegistrationRow';
import { Components } from '.';
import { InjectedComponent } from '../logic';

export class RegistrationForm extends InjectedComponent {
	static wire = ["Competition"];

	addButtonHeader(minorHeaders) {
		minorHeaders.push(<th key={minorHeaders.length} className="minor entry" style={{ width: "20px" }}>&nbsp;</th>);
	}

	addMinorHeadersFor(event, minorHeaders) {
		let initial = minorHeaders.length;
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
			minorHeaders.push(<th key={minorHeaders.length} className="minor entry vert"><div>{event.name}</div></th>);
		}
	}

	RegistrationHeader({ inject }) {
		let participantHeader = this.Competition.participantHeader();
		const majorHeaders = [<th key="-1" className="major" colSpan={participantHeader.subFields.length}>{participantHeader.name}</th>];
		const minorHeaders = [];

		participantHeader.subFields.forEach(s => {
			minorHeaders.push(<th key={minorHeaders.length} style={{ width: s.width, paddingRight: 10, verticalAlign: "bottom" }} className="minor">{s.name}</th>);
		});

		this.Competition.eventGroups.forEach(group => {
			let initial = minorHeaders.length;
			this.Competition.eventList(group.id).forEach(e => this.addMinorHeadersFor(e, minorHeaders));
			majorHeaders.push(<th key={group.id} className="major" colSpan={minorHeaders.length - initial}>{group.name}</th>);
		});

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

	RegistrationRows(props) {
		return <tbody>{props.inject(Components.Registration).participants.map(
			p => <RegistrationRow key={p.id} participant={p} {...props} />
		)}</tbody>;
	}

	render() {
		const RegistrationRows = this.RegistrationRows.bind(this);
		const RegistrationHeader = this.RegistrationHeader.bind(this);
		return <div id='registration' className='content'>
			<table>
				<RegistrationHeader {...this.props} />
				<RegistrationRows {...this.props} />
			</table>
		</div>;
	}
}