import './Dropdown.css';
import React from 'react';
import { InjectedComponent } from '../logic';

export class Dropdown extends InjectedComponent {
	constructor(props) {
		super(props);
		this.state = { text: props.text, drop: false, valueList: [] };
	}

	render() {
		return <div className="dropdown">
			{this.state.text} <button className="dropbutton" onClick={e => this.setState({ drop: !this.state.drop })}>V</button>
			{this.state.drop && <div className="droplist">SomeList</div>}
		</div>;
	}
}