import { Injector } from './logic';
import {
	Toolbar, ParticipantPicker, AppHeader, BusyIndicator, RegistrationContact, RegistrationForm, Footer, Summary,
	StoreQuestion, Schedule, ScheduleProperties
} from './components';
import { RegistrationView, ReportView, ResultView, CreateCompetition, CompetitionView, CompetitionList, About, Login } from './views';
import { App } from './App';

export class Resources {
	static resourceId = 1;
}

export class Components {
	static componentId = 1;
	static App = Components.componentId++;
	static Footer = Components.componentId++;
	static ParticipantPicker = Components.componentId++;
	static Toolbar = Components.componentId++;
	static Competitions = Components.componentId++;
	static AppHeader = Components.componentId++;
	static BusyIndicator = Components.componentId++;
	static RegistrationContact = Components.componentId++;
	static RegistrationForm = Components.componentId++;
	static Summary = Components.componentId++;
	static About = Components.componentId++;
	static Login = Components.componentId++;
	static StoreQuestion = Components.componentId++;

	static Schedule = Components.componentId++;
	static ScheduleProperties = Components.componentId++;

	static CompetitionView = Components.componentId++;
	static RegistrationView = Components.componentId++;
	static ReportView = Components.componentId++;
	static ResultView = Components.componentId++;
	static CreateCompetition = Components.componentId++;
}

export class AppInjector extends Injector {
	constructor() {
		super();
		this.registerComponent(Components.App, App);
		this.registerComponent(Components.Footer, Footer);
		this.registerComponent(Components.ParticipantPicker, ParticipantPicker);
		this.registerComponent(Components.Toolbar, Toolbar);
		this.registerComponent(Components.AppHeader, AppHeader);
		this.registerComponent(Components.BusyIndicator, BusyIndicator);
		this.registerComponent(Components.RegistrationContact, RegistrationContact);
		this.registerComponent(Components.RegistrationForm, RegistrationForm);
		this.registerComponent(Components.Summary, Summary);
		this.registerComponent(Components.Login, Login);
		this.registerComponent(Components.StoreQuestion, StoreQuestion);
		this.registerComponent(Components.About, About);
		this.registerComponent(Components.CreateCompetition, CreateCompetition);
		this.registerComponent(Components.Schedule, Schedule);
		this.registerComponent(Components.ScheduleProperties, ScheduleProperties);

		this.registerComponent(Components.Competitions, CompetitionList);
		this.registerComponent(Components.CompetitionView, CompetitionView);
		this.registerComponent(Components.RegistrationView, RegistrationView);
		this.registerComponent(Components.ReportView, ReportView);
		this.registerComponent(Components.ResultView, ResultView);
	}
}