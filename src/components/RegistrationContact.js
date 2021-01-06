import React from 'react';

export class RegistrationContact extends React.Component {
	static register = { name: "RegistrationContact" };
	static wire = ["fire", "Events", "Registration"];

	render() {
		let minor = [
			{ name: 'Namn*', placeholder: 'Namn', width: 200, type: 'text', field: 'name' },
			{ name: 'Förening', width: 200, type: 'text', field: 'organization' },
			{ name: 'Email*', placeholder: 'Email', width: 200, type: 'email', field: 'email' },
			{ name: 'Konto', placeholder: 'Kontonummer', width: 100, type: 'text', field: 'account' }];

		let model = this.Registration.contact;

		return <div id='registrationContact' className='content'>
			<div className="header">Anmälare&nbsp;<span style={{ fontSize: "x-small", verticalAlign: "top" }}>(* = obligatoriskt fält)</span></div>
			{minor.map(h => <div key={h.name}><p>{h.name}</p><input type='text' placeholder={h.placeholder || h.name} style={{ width: h.width }}
				value={model[h.field]} onChange={e => this.fire(this.Events.setRegistrationInfo, h.field, e.target.value)} /></div>)}
		</div>;
	}
}