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

	setScore = (stageDef, participant, target, value) => {
		value = parseInt(value, 10);
		participant.setScore(stageDef.num, target, isNaN(value) ? undefined : value);
		this.setState({});
	}

	setValue = (participant, stageDef, value) => {
		value = parseInt(value, 10);
		participant.setScore(stageDef.num, stageDef.targets, isNaN(value) ? undefined : value);
		this.setState({});
	}

	participantClass(className, participant, position) {
		return className + " participant" + (participant.error ? " error" : "") + ((position != null && (position % 2 === 0)) ? " even" : "");
	}

	MobileTarget = (props) => {
		let { stageDef, participant, tgt } = props;
		let score = participant.getScore(stageDef.num, tgt);
		return FieldReportTable.targetValues.filter(v => v <= stageDef.max).map(v =>
			<input key={"tgt" + tgt + v} className={"score-button" + (score !== undefined && score === v ? " selected" : "")}
				type="button" value={v} onClick={e => this.setScore(stageDef, participant, tgt, v)} />);
	}

	ComputerTarget = (props) => {
		let { stageDef, participant, tgt, autoFocus } = props;
		let score = participant.getScore(stageDef.num, tgt);
		return <input autoFocus={autoFocus} type="text" className="score-edit" value={score === undefined ? "" : score}
			onChange={e => this.setScore(stageDef, participant, tgt, e.target.value)} />;
	}

	targets(stageDef, participant, id, first) {
		return FieldReportTable.fieldTargetIds.map(i =>
			i < stageDef.targets ?
				<div key={"tgt" + id + i} className={this.participantClass("input", participant, i)}>
					{this.props.mode === "computer" ?
						<this.ComputerTarget stageDef={stageDef} participant={participant} tgt={i} autoFocus={first && i === 0} /> :
						<this.MobileTarget stageDef={stageDef} participant={participant} tgt={i} />}
				</div> : <div key={"tgt" + id + i} />);
	}

	value(stageDef, participant, id) {
		if (!stageDef.value) return <div key={"val" + id} />;
		let score = participant.getScore(stageDef.num, stageDef.targets);
		return <div className={this.participantClass("input", participant, 1)} key={"val" + id}>
			<input className="score-text" type="text" size="2" value={score || ""}
				onChange={e => this.setValue(participant, stageDef, e.target.value)} />
		</div>;
	}

	total(stageDef, participant, id) {
		return <div className={this.participantClass("", participant)} key={"tot" + id}>{participant.getStageTotal(stageDef)}</div>;
	}

	redo(stageDef, participant, id) {
		return <div className={this.participantClass("", participant)} key={"redo" + id}><input type="checkbox" /></div>;
	}

	note(stageDef, participant, id) {
		return <div className={this.participantClass("", participant)} key={"note" + id}><input type="text" /></div>;
	}

	participantRow(stageDef, p, id, first) {
		return [
			<div key={"name" + id} className={this.participantClass("align-left", p)}>{p.name}</div>,
			<div key={"sup" + id} className={this.participantClass("", p)}><input type="checkbox" tabIndex="-1" onClick={e => e.target.checked = !e.target.checked} /></div>,
			[...this.targets(stageDef, p, id, first)],
			this.total(stageDef, p, id),
			this.value(stageDef, p, id),
			this.redo(stageDef, p, id),
			this.note(stageDef, p, id),
			<div className="align-left" key={"spc" + id}>{p.error}</div>
		];
	}

	render() {
		let { stageDef, scores } = this.props;
		let id = 0;
		return <div className={"score-sheet field"}>
			<div className="header align-left">Namn</div>
			<div className="header">Stöd</div>
			{this.headers(stageDef)}
			<div className="header">Total</div>
			{stageDef.value ? <div className="header">Poäng</div> : <div />}
			<div className="header">Omskj.</div>
			<div className="header align-left">Anteckning</div>
			<div>{/* Spacer - empty space to let the interface resize */}</div>
			{scores.map((p, i) => this.participantRow(stageDef, p, id++, i === 0)).flat()}
		</div>;
	}
}