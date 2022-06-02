export class Tokens {
	static register = { name: "Tokens", createInstance: true };
	static wire = ["Storage", "Server"];

	findTokens() {
		if (this.Server.local) { return this.Storage.get(this.Storage.keys.localTokens) || []; }
		return this.Storage.get(this.Storage.keys.tokens) || this.Storage.get("Tokens") || [];
	}

	getToken(competitionId) {
		return this.findTokens()[competitionId];
	}

	setToken(competitionId, token) {
		let tokens = this.findTokens();
		tokens[competitionId] = token;
		this.Storage.set(this.Server.local ? this.Storage.keys.localTokens : this.Storage.keys.tokens, tokens);
	}
}