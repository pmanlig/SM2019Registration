import './ScheduleProperties.css';
import React from 'react';
import { ModalDialog } from './Modal';
import { ButtonToolbar as Toolbar, Label } from './Toolbar';
import { Spinner } from './Spinner'

export class ScheduleProperties extends React.Component {
	static register = true;

	constructor(props) {
		super(props);
		this.state = { slots: 0, startTime: new Date("08:00:00") };
	}

	updateSlots = (v) => {
		if (v < 0)
			return;
		let newVal = parseInt(v, 10);
		if (!isNaN(newVal)) {
			this.setState({ slots: newVal });
		}
	}

	render() {
		return <ModalDialog title="Skjutlag/patruller" onClose={this.props.onClose}>
			<Toolbar className="schedule-tools">
				<Label text="Starttid"><input value={this.state.startTime} size="5" onChange={e => console.log(e.target.value)} /></Label>
				<Label text="Platser" align="center"><Spinner value={this.state.slots} onChange={this.updateSlots} /></Label>
				<Label text="Lägg till skjutlag" align="center"><button className="button-add green" /></Label>
			</Toolbar>
			<table>
				<thead>
					<tr>
						<th>Tid</th>
						<th>Antal platser</th>
						<th>Vapengrupper</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</ModalDialog>;
	}
}