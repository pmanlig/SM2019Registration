import React from 'react';

export class HelpView extends React.Component {
	static register = { name: "HelpView" }
	static wire = ["Events", "EventBus"];

	constructor(props) {
		super(props);
		this.state = { qa: [] }
		fetch('/qa.json')
			.then(res => res.json())
			.then(json => this.setState({ qa: json }));
	}

	componentWillMount() {
		this.EventBus.fire(this.Events.changeTitle, "Hjälp?");
	}

	link(link) {
		if (!link.includes("~")) return link;
		let parts = link.split("~")
		return <a href={parts[0]}>{parts[1]}</a>;
	}

	linkify(text) {
		let parts = text.split("$").map(t => this.link(t));
		return <p>{parts.map((p, index) => <span key={index}>{p}</span>)}</p>;
	}

	render() {
		let qaId = 1;
		return <div className="content">
			<p>Vi gör vårt bästa för att alla funktioner i systemet ska vara intuitiva och självförklarande,
				men om vi misslyckas med det kan du hitta svar på de vanligaste frågorna på den här sidan.</p>
			<p>Hittar du inte svaret på det du undrar över? Kontakta oss via mail: <a href="mailto:anmalan@xkretsen.se">anmalan@xkretsen.se</a></p>
			{this.state.qa.map(qa => <div key={qaId++}>
				<h3>{qa.q}</h3>
				{this.linkify(qa.a)}
			</div>)}
		</div>;
	}
}