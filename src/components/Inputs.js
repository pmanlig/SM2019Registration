import './Inputs.css';
import React from "react";

export function TextInput(props) {
	return <div id={`input-${props.id}`} className="input-wrapper">
		<label htmlFor={props.id}>{props.name}</label>
		<input type="text" {...props} />
	</div>
}

export class ClubSelectorInput extends React.Component {
	static wire = ["ClubSelector"];

	render() {
		return <div id={`input-${this.props.id}`} className="input-wrapper">
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<this.ClubSelector {...this.props} />
		</div>
	}
}