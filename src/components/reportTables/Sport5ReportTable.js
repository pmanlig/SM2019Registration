import React from 'react';
import { Discipline, Mode } from '../../models';

function Redo({ stage, participant, onChange }) {
	return <div className="participant">
		<input type="checkbox" checked={participant.redo > 0} disabled={participant.redo > 0 && participant.redo !== stage}
			onChange={onChange} />
	</div>;
}

function Note({ participant, onChange }) {
	return <div className="participant"><input type="text" value={participant.note || ""} onChange={onChange} /></div>;
}

export class Sport5ReportTable extends React.Component {
	static shots = [1, 2, 3, 4, 5];
	static shotValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "X"];

	headers() {
		return Sport5ReportTable.shots.map(i =>
			<div key={"hdr" + i} className="header">{i}</div>
		);
	}

	setScore = (stage, participant, target, value) => {
		if (value === "") {
			participant.setScore(stage, target, undefined);
		} else if (value.toUpperCase() === "X") {
			participant.setScore(stage, target, "X");
		} else {
			value = parseInt(value, 10);
			if (!isNaN(value) && value >= 0 && value <= 10) {
				participant.setScore(stage, target, value);
			}
		}
		this.setState({});
	}

	setRedo = (p, v) => {
		p.redo = v;
		this.setState({});
	}

	computerTarget(stage, participant, tgt, autoFocus) {
		let score = participant.getScore(stage, tgt);
		return <input autoFocus={autoFocus} type="text" className="score-edit" value={score === undefined ? "" : score}
			onChange={e => this.setScore(stage, participant, tgt, e.target.value)} />;
	}

	mobileTarget(stage, participant, tgt) {
		let score = participant.getScore(stage, tgt);
		const selected = v => (score !== undefined && score.toString() === v) ? " selected" : "";
		return Sport5ReportTable.shotValues.map(v =>
			<input key={"tgt" + tgt + v} className={`score-button${selected(v)}`}
				type="button" value={v} onClick={e => this.setScore(stage, participant, tgt, v)} />);
	}

	participantClass(className, participant, position) {
		return className + " participant" + (participant.error ? " error" : "") + ((position != null && (position % 2 === 0)) ? " even" : "");
	}

	targets(stage, participant, id) {
		return Sport5ReportTable.shots.map((num, i) =>
			<div key={"tgt" + id + num} className={this.participantClass("input", participant, i)}>
				{this.props.mode === Mode.computer ?
					this.computerTarget(stage, participant, i, id === 0 && i === 0) :
					this.mobileTarget(stage, participant, i)}
			</div>);
	}

	participantRow(stage, p, id) {
		const setNote = (p, v) => {
			p.note = v;
			this.setState({});
		}

		return [
			<div key={"pos" + id} className={this.participantClass("", p)}>{p.position}</div>,
			<div key={"name" + id} className={this.participantClass("align-left", p)}>{p.name}</div>,
			<div key={"sup" + id} className={this.participantClass("", p)}><input type="checkbox" disabled tabIndex="-1" checked={p.support === 1} /></div>,
			[...this.targets(stage, p, id)],
			<div className="participant" key={"t" + id}>{p.getPrecisionTotal(stage)}</div>,
			<Redo stage={stage} participant={p} key={"m" + id} onChange={e => this.setRedo(p, e.target.checked ? stage : 0)} />,
			<Note participant={p} key={"n" + id} onChange={e => setNote(p, e.target.value)} />,
			<div className="align-left" key={"spc" + id}>{p.error}</div>
		];
	}

	render() {
		let { stage, scores } = this.props;
		return <div className={"score-sheet field"}>
			<div className="header">Pos</div>
			<div className="header align-left">Namn</div>
			<div className="header">Stöd</div>
			{this.headers()}
			<div className="header">Total</div>
			<div className="header">Omskj.</div>
			<div className="header align-left">Anteckning</div>
			<div className="null align-left">{/* Error */}</div>
			{scores.map((p, i) => this.participantRow(stage, p, i)).flat()}
		</div>;
	}
}

Sport5ReportTable.disciplines = [Discipline.sport5];