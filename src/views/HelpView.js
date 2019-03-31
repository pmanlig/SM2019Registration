import React from 'react';

export class HelpView extends React.Component {
	static register = { name: "HelpView" }
	static wire = ["Events", "EventBus"];

	componentWillMount() {
		this.EventBus.fire(this.Events.changeTitle, "Hjälp?");
	}

	render() {
		return <div className="content">
			<p>Vi gör vårt bästa för att alla funktioner i systemet ska vara intuitiva och självförklarande,
				men om vi misslyckas med det kan du hitta svar på de vanligaste frågorna på den här sidan.</p>
			<p>Hittar du inte svaret på det du undrar över? Skicka ett mail till <a href="mailto:anmalan@xkretsen.se">anmalan@xkretsen.se</a></p>
			<h2>Sidan fungerar inte i Internet Explorer?</h2>
			<p>Tyvärr inte. Internet Explorer är vid det här laget en gammal webbläsare som tyvärr inte stödjer
				de senaste standarderna för webbutveckling. Vi kan lägga till stöd för IE, men det innebär extra
				jobb som vi inte har haft tid med än. Tills vidare rekommenderar vi att du använder <a href="https://www.google.com/chrome/">Chrome</a>.</p>
		</div>;
	}
}