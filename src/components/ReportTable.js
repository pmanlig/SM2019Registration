import './ReportTable.css';
import React from 'react';
import { FieldReportTable } from '.';
import { ScoreTypes } from '../models';

export class ReportTable extends React.Component {
	static register = { name: "ReportTable" };
	static wire = ["Configuration"];

	render() {
		let { results } = this.props;
		if (results.scoreType === ScoreTypes.Field) { return <FieldReportTable mode={this.Configuration.mode} {...this.props} />; }
		return null;
	}
}