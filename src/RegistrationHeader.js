import React, { Component } from 'react';

export class RegistrationHeader extends Component {
	render() {
		const majorHeaders = [];
		const minorHeaders = [];
		this.props.columns.forEach((column) => {
			majorHeaders.push(<th key={majorHeaders.length} class="major" colSpan={column.subfields.length}>{column.name}</th>);
			var classes = column.name === "Skytt" ? "minor" : "minor vert";
			column.subfields.forEach((minor) => {
				minorHeaders.push(<th key={minorHeaders.length} class={classes}><div>{minor.name}</div></th>);
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