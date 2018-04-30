import React from 'react';
import { Components, Events } from '.';

export function RegistrationContact(props) {
	let minor = [
		{ name: 'Namn', width: 200, type: 'text', field: 'name' },
		{ name: 'Förening', width: 200, type: 'text', field: 'organization' },
		{ name: 'Email', width: 200, type: 'email', field: 'email' },
		{ name: 'Konto', placeholder: 'Kontonummer', width: 100, type: 'text', field: 'account' }];
	let model = props.inject(Components.Registration).contact;

	return <div id='registrationContact' className='content'>
		<table>
			<thead>
				<tr><th className='major' colSpan={minor.length}>Anmälare</th></tr>
				<tr>{minor.map(h => <th className='minor' key={h.name} style={{ width: h.width, paddingRight: '10px' }}>{h.name}</th>)}</tr>
			</thead>
			<tbody>
				<tr>{minor.map(h => <td key={h.name}><input type='text' placeholder={h.placeholder || h.name} style={{ width: h.width }}
					value={model[h.field]} onChange={e => props.fire(Events.setRegistrationInfo, h.field, e.target.value)} /></td>)}</tr>
			</tbody>
		</table>
	</div>;
}