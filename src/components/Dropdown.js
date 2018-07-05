import React from 'react';
import { InjectedComponent } from '../logic';

export class Dropdown extends InjectedComponent {
	render() {
		return <select value={this.props.value} onChange={this.props.onChange}>
			<option value="placeholder" hidden>{this.props.placeholder}</option>
			{this.props.items.map(i => <option key={i} value={i}>{i}</option>)}
		</select>;
	}
}