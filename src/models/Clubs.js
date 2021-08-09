export class Clubs {
	static register = { name: "Clubs", createInstance: true };
	static wire = ["fire", "Events", "Server"];

	data = [];

	initialize = () => {
		fetch("/clubs.json")
			.then(res => {
				if (res.ok)
					res.json()
						.then(json => {
							this.data = json;
							this.fire(this.Events.clubsLoaded);
						})
			})
	}
}