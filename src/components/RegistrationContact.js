import React from 'react';

export class RegistrationContact extends React.Component {
	static register = { name: "RegistrationContact" };
	static wire = ["fire", "Events", "Registration", "Competition", "ClubSelector"];

	TextInput = (props) => {
		return <div>
			<label htmlFor={props.id}>{props.name}</label>
			<input id={props.id} type="text" placeholder={props.placeholder} style={{ width: props.width }} value={this.Registration.contact[props.id]} onChange={e => this.fire(this.Events.setRegistrationInfo, props.id, e.target.value)} />
		</div>;
	}

	render() {
		return <div id='registrationContact' className='content'>
			<div className="header">Anmälare&nbsp;<span style={{ fontSize: "x-small", verticalAlign: "top" }}>(* = obligatoriskt fält)</span></div>
			<form>
				<this.TextInput name="Namn*" id="name" placeholder="Namn" width="200" />
				<div>
					<label htmlFor="organization">Förening</label>
					<this.ClubSelector id="organization" placeholder="Förening" style={{ width: 200 }} value={this.Registration.contact["organization"]} onChange={e => this.fire(this.Events.setRegistrationInfo, "organization", e.target.value)} />
				</div>
				<this.TextInput name="Email*" id="email" placeholder="Email" width="200" />
				{this.Competition.rules.includes("show-acct") && <this.TextInput name="Konto" id="account" placeholder="Kontonummer" width="100" />}
			</form>
		</div>;
	}
}