import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { EventBus } from '../EventBus';

export class Competitions extends Component {
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
			competitions: Competitions.initial
		};
		fetch('https://dev.bitnux.com/sm2019/competition')
			.then(result => result.json())
			.then(json => this.setState({ competitions: this.state.competitions.concat(json) }));
	}

	componentDidMount() {
		this.props.injector.inject("EventBus").fire(EventBus.changeTitle, "Anmälningssytem Gävle PK");
	}

	render() {
		return <div>
			<ul>
				{this.state.competitions.map(c => <li key={c.id}><Link to={"/competition/" + c.id}>{c.name}</Link></li>)}
			</ul>
		</div>;
	}
}