import './ReportTable.css';
import React from 'react';
import * as Tables from './reportTables';

export class ReportTable extends React.Component {
	static register = { name: "ReportTable" };

	render() {
		let { event } = this.props;
		for (const t in Tables) {
			if ((typeof Tables[t] === "function") && Tables[t].disciplines && Tables[t].disciplines.includes(event.discipline)) {
				console.log("Found it!");
				const ReportTable = Tables[t];
				return <ReportTable {...this.props} />
			}
			return <p>Grenen stöds tyvärr inte!</p>;
		}
	}
}