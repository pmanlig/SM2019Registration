import React from 'react';
import { InjectedComponent } from '../logic';

export class Schedule extends InjectedComponent {
	render() {
		let junk = [];
		for (let i = 0; i < 200; i++) {
			junk.push(<p key={i}>{i}</p>);
		}

		return <div className="schedule">
			<h1>Schedule</h1>
			{junk}
		</div>;
	}
}