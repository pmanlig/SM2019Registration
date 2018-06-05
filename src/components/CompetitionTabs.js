import './CompetitionTabs.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent } from '../logic';

export class CompetitionTabs extends InjectedComponent {
	render() {
		return <div className="tabs">
			<Link to={"/competition/" + this.props.match.params.id} className="selected">Anmälan</Link>
			<Link to="/">Resultat</Link>
			<Link to="/">Administrera</Link>
		</div>;
	}
}