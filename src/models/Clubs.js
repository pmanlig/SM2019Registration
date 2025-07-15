export class Clubs {
	static register = { name: "Clubs", createInstance: true };
	static wire = ["fire", "subscribe", "Events", "EventBus", "Server", "Configuration"];

	constructor() {
		this.data = [];
	}

	loadClubs = () => {
		this.Server.loadClubs(json => {
			this.data = json;
			this.fire(this.Events.clubsLoaded);
		}, err => {
			console.log("Error loading clubs from backend", err);
		});
	}

	initialize = () => {
		this.subscribe(this.Events.configurationLoaded, this.loadClubs);
		fetch("/clubs.json")
			.then(res => {
				if (res.ok)
					res.json()
						.then(json => {
							this.data = json.map(c => c.name);
							this.fire(this.Events.clubsLoaded);
						})
			})
	}
}