import React, { Component } from 'react';

export class RegistrationHeader extends Component {
	render() {
		const majorHeaders = [];
		const minorHeaders = [];
		this.props.columns.forEach((column) => {
			majorHeaders.push(<th key={majorHeaders.length} colSpan={column.subfields.length}>{column.name}</th>);
			column.subfields.forEach((minor) => {
				minorHeaders.push(<th key={minorHeaders.length} width={minor.width}>{minor.name}</th>);
			});
		});
		return (
			<thead>
				<tr>{majorHeaders}</tr>
				<tr>{minorHeaders}</tr>
			</thead>
		);
	}
}