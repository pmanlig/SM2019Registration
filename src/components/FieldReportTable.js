import './ReportTable.css';
import React from 'react';

export class FieldReportTable extends React.Component {
	static register = { name: "FieldReportTable" };
	static fieldTargets = ["A", "B", "C", "D", "E", "F"];
	static fieldTargetIds = [0, 1, 2, 3, 4, 5];
	static targetValues = [0, 1, 2, 3, 4, 5, 6];

	headers(stageDef) {
		return FieldReportTable.fieldTargetIds.map(i =>
			(stageDef !== undefined && i < stageDef.targets) ?
				<div key={"hdr" + i} className="header">{FieldReportTable.fieldTargets[i]}</div> :
				<div key={"hdr" + i} />
		);
	}

	setScore = (participant, target, value) => {
		if (typeof (value) === "string") { value = parseInt(value, 10); }
		if (isNaN(value)) { value = 0; }
		let stage = this.props.stage;
		if (participant.score[stage] === undefined) { participant.score[stage] = []; }
		participant.score[stage][target] = value;
		this.setState({});
	}

	setValue = (participant, stageDef, value) => {
		let stage = this.props.stage;
		if (participant.score[stage] === undefined) { participant.score[stage] = []; }
		participant.score[stage][stageDef.targets] = value;
		this.setState({});
	}

	participantClass(className, participant) {
		className += " participant";
		return participant.error ? className + " error" : className;
	}

	MobileTarget = (props) => {
		let { stageDef, participant, tgt } = props;
		let scores = participant.score[this.props.stage] || [];
		return FieldReportTable.targetValues.filter(v => v <= stageDef.max).map(v =>
			<input key={"tgt" + tgt + v} className={"score-button" + (scores !== undefined && scores[tgt] === v ? " selected" : "")}
				type="button" value={v} onClick={e => this.setScore(participant, tgt, v)} />);
	}

	ComputerTarget = (props) => {
		let { participant, tgt } = props;
		let scores = participant.score[this.props.stage] || [];
		return <input type="text" className="score-edit" value={scores[tgt] === undefined ? "" : scores[tgt]}
			onChange={e => this.setScore(participant, tgt, e.target.value)} />;
	}

	targets(stageDef, participant, id) {
		return FieldReportTable.fieldTargetIds.map(i =>
			i < stageDef.targets ?
				<div key={"tgt" + id + i} className={this.participantClass("input", participant)}>
					{this.props.mode === "computer" ?
						<this.ComputerTarget participant={participant} tgt={i} /> :
						<this.MobileTarget stageDef={stageDef} participant={participant} tgt={i} />}
				</div> : <div key={"tgt" + id + i} />);
	}

	value(stageDef, participant, id) {
		if (!stageDef.values) return <div key={"val" + id} />;
		let scores = participant.score[this.props.stage] || [];
		return <div className={this.participantClass("", participant)} key={"val" + id}>
			<input className="score-text" type="text" size="2" value={scores[stageDef.targets] || ""}
				onChange={e => this.setValue(participant, stageDef, e.target.value)} />
		</div>;
	}

	total(stageDef, participant, id) {
		let score = participant.score[this.props.stage] || [];
		score = score.slice(0, stageDef.targets)
		return <div className={this.participantClass("", participant)} key={"tot" + id}>
			{score.reduce((a, b) => a + b, 0)}/{score.filter(s => s > 0).length}
		</div>;
	}

	participantRow(stageDef, p, id) {
		return [
			<div key={"name" + id} className={this.participantClass("align-left", p)}>{p.name}</div>,
			[...this.targets(stageDef, p, id)],
			this.total(stageDef, p, id),
			this.value(stageDef, p, id),
			<div className="align-left" key={"spc" + id}>{p.error}</div>
		];
	}

	render() {
		let { results, squad, stage } = this.props;
		if (results.stageDefs === undefined) return null;
		if (results.stageDefs[stage] === undefined) return null;
		if (results.scores === undefined) return null;
		let stageDef = results.stageDefs[stage];
		let scores = results.getScores(squad ? squad.id : undefined);
		let id = 0;
		return <div className={"score-sheet field"}>
			<div className="header align-left">Namn</div>
			{this.headers(stageDef)}
			<div className="header">Total</div>
			{stageDef.values ? <div className="header">Poäng</div> : <div />}
			<div>{/* Spacer - empty space to let the interface resize */}</div>
			{scores.map(p => this.participantRow(stageDef, p, id++)).flat()}
		</div>;
	}
}