export class Person {
	name;
	competitionId;
	organization;
	email;

	constructor(nameOrPerson, id, organization, email, account) {
		this.name = nameOrPerson || "";
		this.competitionId = id || "";
		this.organization = organization || "";
		this.email = email || "";
		this.account = account || "";
		if (typeof nameOrPerson === "object") {
			this.name = nameOrPerson.name;
			this.competitionId = nameOrPerson.competitionId || "";
			this.organization = nameOrPerson.organization || "";
			this.email = nameOrPerson.email || "";
			this.account = nameOrPerson.account || "";
		}
		this.email = this.email.trim();
	}

	setDefaultOrganization(organization) {
		if ([this.name, this.competitionId, this.organization, this.email, this.account].some(v => v && v !== "")) {
			if (!this.organization) {
				this.organization = organization;
			}
		}
	}

	toJson() {
		return {
			name: this.name,
			email: this.email.trim(),
			organization: this.organization,
			account: this.account
		}
	}

	static fromJson(json) {
		return new Person(
			json.name || "",
			json.competitionId || "",
			json.organization || "",
			json.email ? json.email.trim() : "",
			json.account || "");
	}
}