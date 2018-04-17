import React from 'react';
import { Injector } from './Injector';
import { EventBus } from './EventBus';
import { Cookies } from './Cookies';
import { Footers, Footer } from './Footer';
import { Registration, Competitions } from './views';
import { Toolbar, ParticipantPicker, AppHeader, BusyIndicator, Busy, RegistrationContact, RegistrationForm } from './components';

export class AppInjector extends Injector {
	static EventBus = "EventBus";
	static Cookies = "Cookies";
	static Footers = "Footers";
	static Footer = "Footer";
	static ParticipantPicker = "ParticipantPicker";
	static Toolbar = "Toolbar";
	static Registration = "Registration";
	static Competitions = "Competitions";
	static AppHeader = "AppHeader";
	static BusyIndicator = "BusyIndicator";
	static Busy = "Busy";
	static RegistrationContact = "RegistrationContact";
	static RegistrationForm = "RegistrationForm";

	registerComponent(id, Component) {
		this.register(id, props => <Component injector={this} {...props} />);
	}

	constructor() {
		super();
		this.register(AppInjector.EventBus, new EventBus());
		this.register(AppInjector.Cookies, new Cookies(this));
		this.register(AppInjector.Footers, new Footers(this));
		this.register(AppInjector.Busy, new Busy(this));
		this.registerComponent(AppInjector.Footer, Footer);
		this.registerComponent(AppInjector.ParticipantPicker, ParticipantPicker);
		this.registerComponent(AppInjector.Toolbar, Toolbar);
		this.registerComponent(AppInjector.Registration, Registration);
		this.registerComponent(AppInjector.Competitions, Competitions);
		this.registerComponent(AppInjector.AppHeader, AppHeader);
		this.registerComponent(AppInjector.BusyIndicator, BusyIndicator);
		this.registerComponent(AppInjector.RegistrationContact, RegistrationContact);
		this.registerComponent(AppInjector.RegistrationForm, RegistrationForm);
	}
}