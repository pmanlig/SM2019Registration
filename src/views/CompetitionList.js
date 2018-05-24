import "./CompetitionList.css";
import React from 'react';
import { Link } from 'react-router-dom';
import { InjectedComponent } from '../logic';
import { withTitle } from '../components';
import { Components } from '.';

export const CompetitionList = withTitle("Anmälningssytem Gävle PK", class extends InjectedComponent {
	static initial = [
		{
			id: "sm2019",
			name: "SM 2019 (Test)",
			url: "/sm2019.json",
			description: "SM i precision, fält och milsnabb 2019",
			status: "open"
		},
		{
			id: "gf2018",
			name: "Gävligfälten 2018 (Test)",
			url: "/gf2018.json",
			description: "Gävligfälten 2018",
			status: "open"
		}
	];

	constructor(props) {
		super(props);
		this.state = {
			competitions: CompetitionList.initial
		};
		fetch('https://dev.bitnux.com/sm2019/competition')
			.then(result => result.json())
			.then(json => this.setState({ competitions: this.state.competitions.concat(json) }));
	}

	render() {
		let session = this.inject(Components.Session);
		let loggedIn = session.user !== "";
		let tokens = this.inject(Components.Storage).get("Tokens");
		// ToDo: Should check permissions on a per-competition basis
		return <div id='competitions' className='content'>
			<h1>Tävlingar</h1>
			<ul>
				{this.state.competitions.map(c => <li key={c.id}>
					<Link to={"/competition/" + c.id + ((tokens !== undefined && tokens[c.id] !== undefined) ? "/" + tokens[c.id] : "")}>{c.name}</Link>
					{loggedIn && (<span>&nbsp;<Link to={"/admin/" + c.id}>(Administrera)</Link></span>)}
				</li>)}
				{loggedIn && <li><Link to="/create">Skapa ny tävling</Link></li>}
			</ul>
		</div>;
	}
});