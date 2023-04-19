let sum = (a, b) => a + b;
let tgt = x => x > 0;

export class StdFieldScore {
	static calculateScores(results, event) {
		let stages = [];
		event.stages.forEach(s => stages[s.num] = s);
		return results.map(p => {
			let scores = [], targets = [], value = 0;
			for (let i = 0; i < event.scores; i++) {
				scores[i] = 0;
				targets[i] = 0;
			}
			p.scores.forEach(s => {
				if (s.stage <= event.scores) {
					let score = [...s.values];
					if (stages[s.stage].value) { value += score.pop(); }
					scores[s.stage - 1] = score.reduce(sum);
					targets[s.stage - 1] = score.filter(tgt).length;
				}
			});
			return {
				id: p.id,
				name: p.name,
				organization: p.organization,
				scores: scores,
				targets: targets,
				class: p.class,
				total: [scores.reduce(sum), targets.reduce(sum), value]
			}
		});
	}
}