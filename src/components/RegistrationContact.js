import React from 'react';

export function RegistrationContact(props) {
	let minor = [
		{ name: 'Namn', width: 200, type: 'text' },
		{ name: 'Förening', width: 200, type: 'text' },
		{ name: 'Email', width: 200, type: 'email' }];

	return <div id='registrationContact' className='registration'>
		<table>
			<thead>
				<tr><th className='major' colSpan={minor.length}>Anmälare</th></tr>
				<tr>{minor.map(h => <th className='minor' key={h.name} style={{ width: h.width, paddingRight: '10px' }}>{h.name}</th>)}</tr>
			</thead>
			<tbody>
				<tr>{minor.map(h => <td key={h.name}><input type='text' placeholder={h.name} style={{ width: h.width }} /></td>)}</tr>
			</tbody>
		</table>
	</div>;
}