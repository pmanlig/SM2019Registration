import './YesNoDialog.css';
import React from 'react';
import { ModalDialog } from '../general';

export class YesNoDialog extends React.Component {
	static register = { name: "YesNoDialog" }

	render() {
		return <ModalDialog title={this.props.title} className="yes-no-dialog">
			<p>{this.props.text}</p>
			<button className="button small" onClick={e => this.props.action(true)}>Ja</button><button className="button small" onClick={e => this.props.action(false)}>Nej</button>
		</ModalDialog>;
	}
}