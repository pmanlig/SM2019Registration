import './ReportTable.css';
import React from 'react';
import { FieldReportTable } from '.';
import { Discipline } from '../models';

export class ReportTable extends React.Component {
	static register = { name: "ReportTable" };

	render() {
		let { event } = this.props;
		// For debugging
		return <FieldReportTable {...this.props} />;
		// eslint-disable-next-line
		if (Discipline.hasStages(event.discipline)) { return <FieldReportTable {...this.props} />; }
		return null;
	}
}

export class ReportView extends React.Component {
	static register = { name: "ReportView" }

	render() {
		// let { event } = this.props;

		/*
		let hasStages = Discipline.hasStages.includes(event.discipline);
		if (hasStages && (event.stages == null || event.stages.length === 0)) { return <div>Fel! Inga serier/stationer!</div> }
		let stageDefs = event.stages;
		let stageDef = hasStages ? event.stages.find(s => s.num === p3) : [];
		let scores = this.Results.getScores(squad.id);
		scores = scores.sort((a, b) => a.position - b.position);
		scores.forEach((s, i) => s.position = i + 1);

		return <div id="results" className="content">
			<div id="selections">
				<this.EventSelector events={events} event={event} />
				<this.SquadSelector schedule={schedule} squad={squad} />
				<this.StageSelector stages={stageDefs} stage={stageDef} />
				{stageDef && <div>Figurer: {stageDef.targets}</div>}
				{stageDef && <div>Maxträff: {stageDef.max}</div>}
				{stageDef && stageDef.min > 0 && <div>Min: {stageDef.min}</div>}
				{stageDef && stageDef.values && <div>Poängräkning</div>}
				<div id="spacer" style={{ flexGrow: 1 }} />
			</div>
			{stageDef && <this.ReportTable mode={this.Configuration.mode} event={event} stageDef={stageDef} scores={scores} />}
			<this.NextButton />
			<this.QueueButton />
		</div>;
		*/
		return null;
	}
}