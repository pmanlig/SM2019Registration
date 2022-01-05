import './ReportTable.css';
import React from 'react';
import { FieldReportTable } from '.';
import { Disciplines } from '../models';

export class ReportTable extends React.Component {
	static register = { name: "ReportTable" };

	render() {
		let { event } = this.props;
		// For debugging
		return <FieldReportTable {...this.props} />;
		// eslint-disable-next-line
		if (event.discipline === Disciplines.Field) { return <FieldReportTable {...this.props} />; }
		return null;
	}
}