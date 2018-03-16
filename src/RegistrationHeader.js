import React, { Component } from 'react';

export class RegistrationHeader extends Component {
	render() {
		const majorHeaders = [];
		const minorHeaders = [];
		this.props.columns.forEach((column) => {
			majorHeaders.push(<th colspan={column.subfields.length}>{column.name}</th>);
			column.subfields.forEach((minor) => {
				minorHeaders.push(<th width={minor.width}>{minor.name}</th>);
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