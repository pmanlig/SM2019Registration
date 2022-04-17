export class TeamRegistration {
	static register = { name: "TeamRegistration", createInstance: true }
	static wire = ["EventBus", "Events", "Server", "Storage"]

	initialize() {
		this.EventBus.manageEvents(this);
	}
}