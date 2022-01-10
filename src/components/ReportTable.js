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