import React from 'react';
import { Injector, EventBus, Cookies } from './logic';
import { Toolbar, ParticipantPicker, AppHeader, BusyIndicator, Busy, RegistrationContact, RegistrationForm, Footers, Footer, Summary } from './components';
import { Registration, Competitions } from './views';
import { App } from './App';

export class Events {
	static eventId = 1;
	static footersChanged = Events.eventId++;
	static changeTitle = Events.eventId++;
	static busyChanged = Events.eventId++;
	static addParticipant = Events.eventId++;
	static deleteParticipant = Events.eventId++;
	static setParticipantName = Events.eventId++;
	static setParticipantCompetitionId = Events.eventId++;
	static setParticipantOrganization = Events.eventId++;
	static setParticipantDivision = Events.eventId++;
	static register = Events.eventId++;
}

export class Components {
	static componentId = 1;
	static App = Components.componentId++;
	static EventBus = Components.componentId++;
	static Cookies = Components.componentId++;
	static Footers = Components.componentId++;
	static Footer = Components.componentId++;
	static ParticipantPicker = Components.componentId++;
	static Toolbar = Components.componentId++;
	static Registration = Components.componentId++;
	static Competitions = Components.componentId++;
	static AppHeader = Components.componentId++;
	static BusyIndicator = Components.componentId++;
	static Busy = Components.componentId++;
	static RegistrationContact = Components.componentId++;
	static RegistrationForm = Components.componentId++;
	static Summary = Components.componentId++;
}

export class AppInjector extends Injector {
	registerComponent(id, Component) {
		this.register(id, props =>
			<Component
				injector={this}
				inject={this.inject.bind(this)}
				subscribe={this.subscribe.bind(this)}
				fire={this.fire.bind(this)}
				{...props} />);
	}

	constructor() {
		super();
		let ev = new EventBus();
		this.subscribe = ev.subscribe.bind(ev);
		this.fire = ev.fire.bind(ev);
		this.register(Components.EventBus, ev);
		this.register(Components.Cookies, new Cookies(this));
		this.register(Components.Footers, new Footers(this));
		this.register(Components.Busy, new Busy(this));
		this.registerComponent(Components.App, App);
		this.registerComponent(Components.Footer, Footer);
		this.registerComponent(Components.ParticipantPicker, ParticipantPicker);
		this.registerComponent(Components.Toolbar, Toolbar);
		this.registerComponent(Components.Registration, Registration);
		this.registerComponent(Components.Competitions, Competitions);
		this.registerComponent(Components.AppHeader, AppHeader);
		this.registerComponent(Components.BusyIndicator, BusyIndicator);
		this.registerComponent(Components.RegistrationContact, RegistrationContact);
		this.registerComponent(Components.RegistrationForm, RegistrationForm);
		this.registerComponent(Components.Summary, Summary);
	}
}