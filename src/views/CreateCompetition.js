import React from 'react';
import { Events, InjectedComponent } from '../logic';

export class CreateCompetition extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
			events: []
		};
	}

	componentDidMount() {
		this.fire(Events.changeTitle, "Skapa ny tävling");
	}

	render() {
		// ToDo: Load disciplines dynamically
		let id = 0;
		return <div className="content">
			<table>
				<tbody>
					<tr><th>Namn</th></tr>
					<tr><input type="text" value={this.state.name} size="50" placeHolder="Namn" onChange={e => this.setState({ name: e.value })} /></tr>
					<tr><th>Beskrivning</th></tr>
					<tr><input type="text" value={this.state.name} size="50" placeHolder="Beskrivning" onChange={e => this.setState({ description: e.value })} /></tr>
					<tr><th>Deltävlingar</th></tr>
					<tr><td><input type="text" size="25" placeHolder="Deltävlingens namn" /><button>+</button></td></tr>
					<tr><td><ul>
						{this.state.events.map(e => { return <li key={id++}>{e.name}</li> })}
					</ul></td></tr>
				</tbody>
			</table>
		</div>;
	}
}