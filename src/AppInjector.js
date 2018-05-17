import { Injector, EventBus, Server, Storage } from './logic';
import { Registry, Registration, Session } from './models';
import { Toolbar, ParticipantPicker, AppHeader, BusyIndicator, Busy, RegistrationContact, RegistrationForm, Footers, Footer, Summary, StoreQuestion } from './components';
import { RegistrationView, CreateCompetition, CompetitionList, About, Login } from './views';
import { App } from './App';

export class StorageKeys {
	static allowStorage = "allowStorage";
	static lastContact = "lastContact";
	static registry = "registry";
}

export class Resources {
	static resourceId = 1;
}

export class Events {
	static eventId = 1;
	static addFooter = Events.eventId++;
	static footersChanged = Events.eventId++;
	static changeTitle = Events.eventId++;
	static busyChanged = Events.eventId++;
	static addParticipant = Events.eventId++;
	static deleteParticipant = Events.eventId++;
	static setParticipantField = Events.eventId++;
	static setParticipantDivision = Events.eventId++;
	static showParticipantPicker = Events.eventId++;
	static registryUpdated = Events.eventId++;
	static setRegistrationInfo = Events.eventId++;
	static registrationUpdated = Events.eventId++;
	static register = Events.eventId++;
}

export class Components {
	static componentId = 1;
	static App = Components.componentId++;
	static EventBus = Components.componentId++;
	static Server = Components.componentId++;
	static Storage = Components.componentId++;
	static Footers = Components.componentId++;
	static Footer = Components.componentId++;
	static ParticipantPicker = Components.componentId++;
	static Toolbar = Components.componentId++;
	static Registration = Components.componentId++;
	static Competitions = Components.componentId++;
	static CreateCompetition = Components.componentId++;
	static AppHeader = Components.componentId++;
	static BusyIndicator = Components.componentId++;
	static Busy = Components.componentId++;
	static RegistrationView = Components.componentId++;
	static RegistrationContact = Components.componentId++;
	static RegistrationForm = Components.componentId++;
	static Summary = Components.componentId++;
	static Registry = Components.componentId++;
	static Session = Components.componentId++;
	static About = Components.componentId++;
	static Login = Components.componentId++;
	static StoreQuestion = Components.componentId++;
}

export class AppInjector extends Injector {
	constructor() {
		super();
		let ev = new EventBus();
		this.subscribe = ev.subscribe.bind(ev);
		this.fire = ev.fire.bind(ev);
		this.register(Components.EventBus, ev);
		let storage = new Storage(this);
		storage.registerKey(StorageKeys.allowStorage);
		storage.registerKey(StorageKeys.lastContact);
		storage.registerKey(StorageKeys.registry);
		this.register(Components.Storage, storage);
		this.register(Components.Server, new Server(this));
		this.register(Components.Session, new Session(this));
		this.register(Components.Footers, new Footers(this));
		this.register(Components.Busy, new Busy(this));
		this.register(Components.Registry, new Registry(this));
		this.register(Components.Registration, new Registration(this));
		this.registerComponent(Components.App, App);
		this.registerComponent(Components.Footer, Footer);
		this.registerComponent(Components.ParticipantPicker, ParticipantPicker);
		this.registerComponent(Components.Toolbar, Toolbar);
		this.registerComponent(Components.RegistrationView, RegistrationView);
		this.registerComponent(Components.Competitions, CompetitionList);
		this.registerComponent(Components.CreateCompetition, CreateCompetition);
		this.registerComponent(Components.AppHeader, AppHeader);
		this.registerComponent(Components.BusyIndicator, BusyIndicator);
		this.registerComponent(Components.RegistrationContact, RegistrationContact);
		this.registerComponent(Components.RegistrationForm, RegistrationForm);
		this.registerComponent(Components.Summary, Summary);
		this.registerComponent(Components.About, About);
		this.registerComponent(Components.Login, Login);
		this.registerComponent(Components.StoreQuestion, StoreQuestion);
	}
}