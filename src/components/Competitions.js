import React from 'react';
import { Link } from 'react-router-dom';

export function Competitions(props) {
	return <div>
		<ul>
			<li><Link to='/competition/sm2019'>SM 2019</Link></li>
			<li><Link to='/competition/gf2018'>Gävligfälten 2018</Link></li>
		</ul>
	</div>;
}