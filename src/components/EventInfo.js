import React from 'react';
import { InjectedComponent } from '../logic';

export class EventInfo extends InjectedComponent {
	selectSchedule = () => {

	}
	
	render() {
		return <li>
			<div>{this.props.event.name}</div>
			<input type="text" size="15" placeholder="Inget datum valt" />
			<select className="eventInfo" onChange={this.selectSchedule}>
				<option value="none">Inget schema</option>
				<option value="new">Nytt schema...</option>
			</select>
			<select className="eventInfo">
				<option value="none">Inga vapengrupper</option>
				<option value="new">Ny indelning...</option>
			</select>
			<select className="eventInfo">
				<option value="none">Ingen klassindelning</option>
				<option value="new">Ny indelning...</option>
			</select>
		</li>;
	}
}