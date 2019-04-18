import React from 'react';

export class RegistrationContact extends React.Component {
	static register = { name: "RegistrationContact" };
	static wire = ["fire", "Events", "Registration"];

	render() {
		let minor = [
			{ name: 'Namn*', width: 200, type: 'text', field: 'name' },
			{ name: 'Förening', width: 200, type: 'text', field: 'organization' },
			{ name: 'Email*', width: 200, type: 'email', field: 'email' },
			{ name: 'Konto', placeholder: 'Kontonummer', width: 100, type: 'text', field: 'account' }];

		let model = this.Registration.contact;

		return <div id='registrationContact' className='content'>
			<table>
				<thead>
					<tr><th className='major' colSpan={minor.length}>Anmälare&nbsp;<span style={{ fontSize: "x-small", verticalAlign: "top" }}>(* = obligatoriskt fält)</span></th></tr>
					<tr>{minor.map(h => <th className='minor' key={h.name} style={{ width: h.width, paddingRight: '10px' }}>{h.name}</th>)}</tr>
				</thead>
				<tbody>
					<tr>{minor.map(h => <td key={h.name}><input type='text' placeholder={h.placeholder || h.name} style={{ width: h.width }}
						value={model[h.field]} onChange={e => this.fire(this.Events.setRegistrationInfo, h.field, e.target.value)} /></td>)}</tr>
				</tbody>
			</table>
		</div>;
	}
}