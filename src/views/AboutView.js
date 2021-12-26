import React from 'react';

export class AboutView extends React.Component {
	static register = { name: "AboutView" };
	static wire = ["EventBus", "Events"];

	componentDidMount() {
		this.EventBus.fire(this.Events.changeTitle, "Om systemet");
	}

	render() {
		return <div id='about' className='content'>
			<h2>Om tävlingsanmälan Gävle PK</h2>
			<p>Det här anmälningssystemet är framtaget för att hantera föranmälningar till skyttetävlingar.
				Vi vet att det finns flera andra system, men när vi började fanns det inget system som vi
				enkelt kunde använda för våra egna tävlingar. Därför började vi att göra ett eget system runt 2014.
				När vi började bestämde vi oss för att göra ett system som i framtiden även skulle kunna användas
				av andra som kanske skulle finna sig själva i samma sits som vi var i när vi började. I skrivande
				stund finns det andra system som liksom det här systemet är möjligt för andra att använda, men vi
				kommer ändå att fortsätta utveckla det här systemet och göra det så bra som möjligt!</p>
			<p>Våra mål med systemet är att det ska:</p>
			<ul>
				<li>Gå att använda av andra än oss själva - vilken annan förening som helst ska kunna administrera sina
					tävlingar i systemet.</li>
				<li>Stödja alla typer av tävlingar oavsett om det är en tävling i Precision, Fält, PPC, IPSC eller någon
					annan gren. Vilka vapengrupper/divisioner som går att välja i respektive gren ska vara konfigurerbart så
					att systemet kan hantera vilken gren som helst.</li>
				<li>Vara modernt och smidigt att använda. Systemet ska inte kräva att användare skapar någon inloggning
					och håller rätt på ett lösenord.</li>
			</ul>
			<p>Just nu hanterar systemet tävlingsanmälningar, men vi hoppas kunna lägga till resultatredovisning innan
				SM 2019.</p>
			<p>Systemet är skrivet i <a href='https://reactjs.org/'>React</a> och <a href='http://www.php.net/'>PHP</a>.
				Vi som har utvecklat systemet heter <a href='mailto:ordforande@gavlepistol.se'>Patrik Manlig</a> (användargränssnitt)
				och Johan Söderberg (tjänster och databas).</p>
		</div>
	}
}