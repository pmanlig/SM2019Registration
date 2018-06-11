import "./CompetitionView.css";
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { Components, Events } from '.';

export class CompetitionView extends InjectedComponent {
	constructor(props) {
		super(props);
		this.subscribe(Events.competitionUpdated, () => this.setState({}));
		this.inject(Components.Competition).load(props.match.params.id);
	}

	render() {
		let operation = this.props.match.params.operation;
		let tabs = [
			{ name: "Anmälan", path: "register", component: this.inject(Components.RegistrationView) },
			{ name: "Rapportera", path: "report", component: this.inject(Components.ReportView) },
			{ name: "Resultat", path: "results", component: () => <h5>Resultat</h5> },
			{ name: "Administrera", path: "admin", component: () => <h5>Administrera</h5> }
		];

		let Content = null;
		tabs.forEach(t => { if (operation === t.path) { Content = t.component; } });
		if (Content === null) {
			return <Redirect to='/' />;
		}

		return <div>
			<div className="tabs">
				{
					tabs.map(t => {
						// ToDo: implement permissions
						if (operation === t.path) {
							return <p key={t.path} className="tab">{t.name}</p>
						}
						return <Link key={t.path} className="tab" to={"/competition/" + this.props.match.params.id + "/" + t.path}>{t.name}</Link>;
					})
				}
			</div>
			<Content {...this.props} />
		</div>;
	}
}