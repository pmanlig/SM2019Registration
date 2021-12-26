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

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Hjälp?");
	}

	link(link) {
		if (!link.includes("~")) return link;
		let parts = link.split("~")
		return <a href={parts[0]}>{parts[1]}</a>;
	}

	linkify(text) {
		return text.split("\n").map((p, k) => <p key={k}>{
			p.split("$").map((t, i) => <span key={i}>{this.link(t)}</span>)
		}</p>);
	}

	render() {
		let qaId = 1;
		return <div className="content">
			<p>Vi gör vårt bästa för att alla funktioner i systemet ska vara intuitiva och självförklarande,
				men om vi misslyckas med det kan du hitta svar på de vanligaste frågorna på den här sidan.</p>
			<p>Hittar du inte svaret på det du undrar över? Kontakta oss via mail: <a href="mailto:anmalan@xkretsen.se">anmalan@xkretsen.se</a></p>
			<h3>Hur anmäler jag mig?</h3>
			<p>Klicka på en tävling på startsidan. Fyll i dina egna uppgifter under "Anmälare" och klicka sedan på "Lägg till deltagare" för att
				lägga till en eller flera deltagare som du vill anmäla.</p>
			<p>För varje deltagare väljer du vilken klass deltagaren tillhör. Om du vill anmäla deltagaren till fler än en start kan du lägga till fler
				starter genom att klicka på knappen <button className="button-add small" />. Välj sedan en vapengrupp för varje start och klicka på
				knappen <button className="scheduleButton">Välj starttid</button> så kommer en lista över starttider att visas. Du väljer en starttid
				genom att klicka på rubriken för ett skjutlag/patrull.</p>
			<p>Listan över starttider hjälper dig att välja starttider som inte krockar. Om en starttid inte går att välja för att den krockar med
				en starttid du redan har valt, kommer den starttiden att visas "dimmad" och inte gå att klicka på. Om en starttid är full kommer den
				att vara röd och går inte heller att klicka på. Du kan alltså bara välja starttider som inte krockar med redan valda starttider.</p>
			{
				this.state.qa.map(qa => <div key={qaId++}>
					<h3>{qa.q}</h3>
					{this.linkify(qa.a)}
				</div>)
			}
		</div >;
	}
}