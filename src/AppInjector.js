import { Injector } from './Injector';
import { registerFooter } from './Footer';
import { registerParticipantPicker } from './components/ParticipantPicker';
import { registerRegistration } from './components/Registration';

export class AppInjector extends Injector {
	app;
	state;

	constructor(app) {
		super();
		this.app = app;
		registerFooter(this);
		registerParticipantPicker(this);
		registerRegistration(this);
		app.state = { ...this.state };
	}
}