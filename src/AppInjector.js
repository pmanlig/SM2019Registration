import React from 'react';
import { Injector } from './Injector';
import { EventBus } from './EventBus';
import { Cookies } from './Cookies';
import { Footers, Footer } from './Footer';
import { ParticipantPicker } from './components/ParticipantPicker';
import { Registration } from './components/Registration';
import { Toolbar } from './components/Toolbar';

export class AppInjector extends Injector {
	static EventBus = "EventBus";
	static Cookies = "Cookies";
	static Footers = "Footers";
	static Footer = "Footer";
	static ParticipantPicker = "ParticipantPicker";
	static Registration = "Registration";
	static Toolbar = "Toolbar";

	registerComponent(id, Component) {
		this.register(id, props => <Component injector={this} {...props} />);
	}

	constructor() {
		super();
		this.register(AppInjector.EventBus, new EventBus());
		this.register(AppInjector.Cookies, new Cookies(this));
		this.register(AppInjector.Footers, new Footers(this));
		this.registerComponent(AppInjector.Footer, Footer);
		this.registerComponent(AppInjector.ParticipantPicker, ParticipantPicker);
		this.registerComponent(AppInjector.Registration, Registration);
		this.registerComponent(AppInjector.Toolbar, Toolbar);
	}
}