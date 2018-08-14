import React from 'react';
import { Schedule } from '../models';

let divisionGroups = [
	{
		id: 1,
		description: "SPSF Precision",
		divisions: ["A", "B", "C"]
	},
	{
		id: 2,
		description: "SPSF Fält",
		divisions: ["A", "B", "C", "R", "A+R"]
	}
];
let schedule = new Schedule();

export class ComponentTest extends React.Component {
	static wire = ["ScheduleProperties"];

	constructor(props) {
		super(props);
		this.state = { showDialog: true };
	}

	render() {
		return <div className="content">
			<button className="button button-close small" />
			<button className="button button-add small" />
			<button className="button button-previous small" />
			<button className="button button-next small" />
			<button className="button button-expand small" />
			<button className="button button-collapse small" />
			<button className="button button-down small" />
			<button className="button button-up small" />
			<button className="button button-left small" />
			<button className="button button-right small" />
			<button className="button button-close" />
			<button className="button button-add" />
			<button className="button button-previous" />
			<button className="button button-next" />
			<button className="button button-expand" />
			<button className="button button-collapse" />
			<button className="button button-down" />
			<button className="button button-up" />
			<button className="button button-left" />
			<button className="button button-right" />
			<button className="button button-close large" />
			<button className="button button-add large" />
			<button className="button button-previous large" />
			<button className="button button-next large" />
			<button className="button button-expand large" />
			<button className="button button-collapse large" />
			<button className="button button-down large" />
			<button className="button button-up large" />
			<button className="button button-left large" />
			<button className="button button-right large" />
			<button className="button button-close x-large" />
			<button className="button button-add x-large" />
			<button className="button button-previous x-large" />
			<button className="button button-next x-large" />
			<button className="button button-expand x-large" />
			<button className="button button-collapse x-large" />
			<button className="button button-down x-large" />
			<button className="button button-up x-large" />
			<button className="button button-left x-large" />
			<button className="button button-right x-large" />
			{this.state.showDialog && <this.ScheduleProperties schedule={schedule} divisions={divisionGroups[0]} onClose={e => this.setState({ showDialog: false })} />}
		</div>;
	}
}