import { Injector } from './logic';

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
}