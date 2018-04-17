import React from 'react';

export function RegistrationContact(props) {
	let minor = ['Namn', 'Förening', 'Email'];

	return <div id='registrationContact' className='registration'>
		<table>
			<thead>
				<tr><th className='major' colSpan={minor.length}>Anmälare</th></tr>
				<tr>{minor.map(h => <th className='minor' key={h}>{h}</th>)}</tr>
			</thead>
			<tbody>
				<tr>{minor.map(h => <td key={h}><input type='text' placeholder={h}/></td>)}</tr>
			</tbody>
		</table>
	</div>;
}