import React, { Component } from 'react';

export class RegistrationRows extends Component {
	cellDefinition(cellType) {
		switch (cellType) {
			case 'check':
				return (<input type='checkbox' />);
			case 'text':
			case 'number':
				return (<input type='text' />);
			default:
				return null;
		}
	}

	deleteButton(id) {
		return (<td><button onClick={(e) => this.deleteEntrant(id)}>X</button></td>);
	}

	deleteEntrant(id) {
		alert("Deleting entrant " + id);
	}

	render() {
		const rows = [];
		var cells;
		var minorLoop = function (minor) {
			cells.push(<td>{this.cellDefinition(minor.type)}</td>);
		}
		var majorLoop = function (major) {
			major.subfields.forEach(minorLoop.bind(this));
		}
		for (var i = 0; i < 5; i++) {
			cells = [];
			this.props.columns.forEach(majorLoop.bind(this));
			rows.push(<tr>{cells}{this.deleteButton(i)}</tr>);
		}
		return (<tbody>{rows}</tbody>);
	}
}