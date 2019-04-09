import './AdminView.css';
import React from 'react';

export class AdminView extends React.Component {
	static register = { name: "AdminView" };
	static wire = ["ClassGroups", "DivisionGroups"];

	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		this.ClassGroups.load(cg => this.setState({}));
		this.DivisionGroups.load(dg => this.setState({}));
	}

	selectedText() {
		if (!this.state.selected) return "";
		if (this.state.selected.classes) return this.state.selected.classes.join("\n");
		if (this.state.selected.divisions) return this.state.selected.divisions.join("\n");
		return "";
	}

	renderGroup(item) {
		return <p key={item.id} className={item === this.state.selected ? "selected" : ""} onClick={e => this.setState({ selected: item })}>{item.description}</p>;
	}

	updateText = e => {
		if (this.state.selected.classes) {
			let newCG = this.ClassGroups.find(x => x.id === this.state.selected.id);
			newCG.classes = e.target.value.split("\n").filter(g => g !== "");
			newCG.dirty = true;
			this.setState({ selected: newCG });
		}
		if (this.state.selected.divisions) {
			let newDG = this.DivisionGroups.find(x => x.id === this.state.selected.id);
			newDG.divisions = e.target.value.split("\n").filter(g => g !== "");
			newDG.dirty = true;
			this.setState({ selected: newDG });
		}
	}

	render() {
		return <div id="admin-view" className="content">
			<div>
				<div>
					<h3>Klassindelningar</h3>
					{this.ClassGroups.classGroups.map(cg => this.renderGroup(cg))}
				</div>
				<div>
					<h3>Vapengruppsindelningar</h3>
					{this.DivisionGroups.divisionGroups.map(dg => this.renderGroup(dg))}
				</div>
			</div>
			<div>
				<h3>Värden</h3>
				<textarea rows="20" cols="50" value={this.selectedText()} onChange={this.updateText} />
			</div>
		</div>;
	}
}