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

export class FieldReportTable extends React.Component {
	static fieldTargets = ["1", "2", "3", "4", "5", "6"];
	static fieldTargetIds = [0, 1, 2, 3, 4, 5];
	static targetValues = [0, 1, 2, 3, 4, 5, 6];

	headers(stageDef) {
		return FieldReportTable.fieldTargetIds.map(i =>
			(stageDef !== undefined && i < stageDef.targets) ?
				<div key={"hdr" + i} className="header">{FieldReportTable.fieldTargets[i]}</div> :
				<div key={"hdr" + i} className="null" />
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
		const selected = v => (score !== undefined && score === v) ? " selected" : "";
		return FieldReportTable.targetValues.filter(v => v <= stageDef.max).map(v =>
			<input key={"tgt" + tgt + v} className={`score-button${selected(v)}`}
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
					{this.props.mode === Mode.computer ?
						<this.ComputerTarget stageDef={stageDef} participant={participant} tgt={i} autoFocus={first && i === 0} /> :
						<this.MobileTarget stageDef={stageDef} participant={participant} tgt={i} />}
				</div> : <div key={"tgt" + id + i} />);
	}

	static singleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	static tenValues = [10, 20, 30];

	MobileValue = ({ stageDef, participant, score }) => {
		let singles = score % 10 || 0;
		let tens = Math.floor(score / 10) * 10 || 0;
		let i = 0;
		const selected = s => s ? " selected" : "";
		const setValue = (v, present, other) => this.setValue(participant, stageDef, (v === present ? 0 : v) + other);
		return <div className="mobile-target">
			<div>{FieldReportTable.tenValues.map(v => <input key={`v${i++}`} className={`score-button${selected(v === tens)}`}
				type="button" value={v} onClick={() => setValue(v, tens, singles)} />)}</div>
			<div>{FieldReportTable.singleValues.map(v => <input key={`v${i++}`} className={`score-button${selected(v === singles)}`}
				type="button" value={v} onClick={() => setValue(v, singles, tens)} />)}</div>
			<div><input key={`v${i++}`} className={`score-button${selected(score !== undefined && score === 0)}`} type="button" value={0}
				onClick={e => this.setValue(participant, stageDef, 0)} /></div>
		</div>;
	}

	ComputerValue = ({ stageDef, participant, score }) => {
		return <input className="score-text" type="text" size="2" value={score === undefined ? "" : score}
			onChange={e => this.setValue(participant, stageDef, e.target.value)} />
	}

	Value = ({ stageDef, participant }) => {
		if (!stageDef.value) return <div />;
		let score = participant.getScore(stageDef.num, stageDef.targets);
		return <div className={this.participantClass("input", participant, 1)}>
			{this.props.mode === Mode.computer ?
				<this.ComputerValue stageDef={stageDef} participant={participant} score={score} /> :
				<this.MobileValue stageDef={stageDef} participant={participant} score={score} />
			}
		</div>;
	}

	setNote = (p, v) => {
		p.note = v;
		this.setState({});
	}

	setRedo = (p, v) => {
		p.redo = v;
		this.setState({});
	}

	participantRow(stageDef, p, id, first) {
		return [
			<div key={"pos" + id} className={this.participantClass("", p)}>{p.position}</div>,
			<div key={"name" + id} className={this.participantClass("align-left", p)}>{p.name}</div>,
			<div key={"sup" + id} className={this.participantClass("", p)}><input type="checkbox" disabled tabIndex="-1" checked={p.support === 1} /></div>,
			[...this.targets(stageDef, p, id, first)],
			<div className="participant" key={"t" + id}>{p.getStageTotal(stageDef)}</div>,
			<this.Value stageDef={stageDef} participant={p} key={"v" + id} />,
			<Redo stage={stageDef.num} participant={p} key={"m" + id} onChange={e => this.setRedo(p, e.target.checked ? stageDef.num : 0)} />,
			<Note participant={p} key={"n" + id} onChange={e => this.setNote(p, e.target.value)} />,
			<div className="align-left" key={"spc" + id}>{p.error}</div>
		];
	}

	render() {
		let { event, stage, scores } = this.props;
		let stageDef = event.stages.find(s => s.num === stage);
		let id = 0;
		return <div className={"score-sheet field"}>
			<div className="header">Pos</div>
			<div className="header align-left">Namn</div>
			<div className="header">Stöd</div>
			{this.headers(stageDef)}
			<div className="header">Total</div>
			{stageDef.value ? <div className="header">Poäng</div> : <div className="null" />}
			<div className="header">Omskj.</div>
			<div className="header align-left">Anteckning</div>
			<div className="null align-left">{/* Error */}</div>
			{scores.map((p, i) => this.participantRow(stageDef, p, id++, i === 0)).flat()}
		</div>;
	}
}

FieldReportTable.disciplines = [Discipline.fieldP, Discipline.fieldK, Discipline.scoredP, Discipline.scoredK];