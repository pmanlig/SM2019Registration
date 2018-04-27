import React, { Component } from 'react';
import { StorageKeys } from '.';

export class StoreQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: true };
	}

	hide(save) {
		if (save) {
			this.props.storage.set(StorageKeys.allowStorage, true);
		}
		this.setState({ visible: false });
	}

	render() {
		return this.state.visible && <div id="storeQuestion">
			<p className="centered">Vill du att information du matar in ska sparas så att det blir lättare att anmäla nästa gång?</p>
			<input className="button cookieButton" type="button" value="Nej" onClick={() => this.hide(false)} />
			<input className="button cookieButton" type="button" value="Ja" onClick={() => this.hide(true)} />
		</div >;
	}
}

// 			this.injector.inject(Components.Footers).addCustomFooter(<CookieAlert key="cookieAlert" cookies={this} />);