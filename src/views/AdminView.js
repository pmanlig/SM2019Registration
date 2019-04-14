import './AdminView.css';
import React from 'react';

export class AdminView extends React.Component {
	static register = { name: "AdminView" };
	static wire = ["fire", "Events", "ClassGroups", "DivisionGroups", "YesNoDialog"];

	constructor(props) {
		super(props);
		this.state = { classGroups: [], divisionGroups: [] }
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Administrera klasser och vapengrupper");
		this.ClassGroups.load(g => this.setState({ classGroups: this.tagList(g, "classGroup") }));
		this.DivisionGroups.load(g => this.setState({ divisionGroups: this.tagList(g, "divisionGroup") }));
	}

	tagList(list, tag) {
		return list.map(e => { e.dataType = tag; return e; });
	}

	selectedText() {
		if (!this.state.selected) return "";
		if (this.state.selected.classes) return this.state.selected.classes.join("\n");
		if (this.state.selected.divisions) return this.state.selected.divisions.join("\n");
		return "";
	}

	drag = (e, item) => {
		e.dataTransfer.setData(item.dataType, item.id.toString());
	}

	allowDrop = (e, item) => {
		if (e.dataTransfer.getData(item.dataType) !== undefined)
			e.preventDefault();
	}

	drop = (e, item) => {
		let data = e.dataTransfer.getData(item.dataType);
		console.log("Dropped " + data);
		e.preventDefault();
		if (item.classes) {
			let draggedItem = this.state.classGroups.find(cg => cg.id.toString() === data);
			let newList = this.state.classGroups.filter(cg => cg !== draggedItem);
			newList.splice(newList.findIndex(cg => cg === item), 0, draggedItem);
			this.setState({ classGroups: newList, dirty: true });
		}
		if (item.divisions) {
			let draggedItem = this.state.divisionGroups.find(cg => cg.id.toString() === data);
			let newList = this.state.divisionGroups.filter(dg => dg !== draggedItem);
			newList.splice(newList.findIndex(dg => dg === item), 0, draggedItem);
			this.setState({ divisionGroups: newList, dirty: true });
		}
	}

	updateText = e => {
		if (this.state.selected.classes) {
			let newCG = this.state.classGroups.find(x => x.id === this.state.selected.id);
			newCG.classes = e.target.value.replace(/^\n+/g, '').replace(/\n+$/, '\n').split("\n");
			this.setState({ selected: newCG, dirty: true });
		}
		if (this.state.selected.divisions) {
			let newDG = this.state.divisionGroups.find(x => x.id === this.state.selected.id);
			newDG.divisions = e.target.value.split("\n");
			this.setState({ selected: newDG, dirty: true });
		}
	}

	addClassGroup = () => {
		let newCG = { id: this.state.classGroups.filter(g => g.id < 1000).length + 1, description: "Ny lista", classes: [], dataType: "classGroup" };
		this.setState({ classGroups: this.state.classGroups.concat([newCG]), selected: newCG, dirty: true });
	}

	addDivisionGroup = () => {
		let newDG = { id: this.state.divisionGroups.filter(g => g.id < 1000).length + 1, description: "Ny lista", divisions: [], dataType: "divisionGroup" };
		this.setState({ divisionGroups: this.state.divisionGroups.concat([newDG]), selected: newDG, dirty: true });
	}

	updateDescription = e => {
		this.setState({
			classGroups: this.state.classGroups.map(cg => {
				if (cg === this.state.selected) {
					cg.description = e.target.value;
				}
				return cg;
			}),
			divisionGroups: this.state.divisionGroups.map(dg => {
				if (dg === this.state.selected) {
					dg.description = e.target.value;
				}
				return dg;
			}),
			dirty: true
		});
	}

	deleteItem = act => {
		if (act) {
			this.setState({
				classGroups: this.state.classGroups.filter(g => g !== this.state.deleteItem),
				divisionGroups: this.state.divisionGroups.filter(g => g !== this.state.deleteItem),
				deleteItem: undefined, dirty: true
			});
		} else {
			this.setState({ deleteItem: undefined });
		}
	}

	save = () => {
		this.ClassGroups.save(this.state.classGroups);
		this.DivisionGroups.save(this.state.divisionGroups);
		this.setState({ dirty: false });
	}

	renderGroup(item) {
		return <div key={item.id} className={item === this.state.selected ? "item select selected" : "item select"}>
			<p draggable="true" onDragStart={e => this.drag(e, item)} onDragOver={e => this.allowDrop(e, item)} onDrop={e => this.drop(e, item)}
				onClick={e => this.setState({ selected: item })}>{item.description}</p>
			<button className="button-close small red" onClick={e => this.setState({ deleteItem: item })} />
		</div>;
	}

	render() {
		return <div className="content">
			{this.state.deleteItem && <this.YesNoDialog title="Bekräfta borttagning" text={`Är du säker på att du vill radera ${this.state.deleteItem.description}?`} action={act => this.deleteItem(act)} />}
			<button className={this.state.dirty ? "button" : "button disabled"} onClick={this.save}>Spara</button>
			<div id="admin-view">
				<div>
					<h3>Klassindelningar</h3>
					{this.state.classGroups.map(cg => this.renderGroup(cg))}
					<div className="add item"><button className="button-add small" /><p className="add" onClick={this.addClassGroup}>Skapa ny lista</p></div>
				</div>
				{this.state.selected && this.state.selected.classes && <div className="detail">
					<input value={this.state.selected.description} onChange={this.updateDescription} />
					<textarea rows="20" cols="50" multiline="true" value={this.selectedText()} onChange={this.updateText} />
				</div>}
				<div>
					<h3>Vapengruppsindelningar</h3>
					{this.state.divisionGroups.map(dg => this.renderGroup(dg))}
					<div className="add item"><button className="button-add small" /><p className="add" onClick={this.addDivisionGroup}>Skapa ny lista</p></div>
				</div>
				{this.state.selected && this.state.selected.divisions && <div className="detail">
					<input value={this.state.selected.description} onChange={this.updateDescription} />
					<textarea rows="20" cols="50" multiline="true" value={this.selectedText()} onChange={this.updateText} />
				</div>}
			</div></div>;
	}
}