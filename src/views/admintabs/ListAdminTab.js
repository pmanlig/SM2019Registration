import React from 'react';
import { ClassGroup, DivisionGroup, TabInfo } from '../../models';

export class ListAdminTab extends React.Component {
	static register = { name: "ListAdminView" };
	static wire = ["fire", "Events", "ClassGroups", "DivisionGroups", "YesNoDialog"];
	static adminTab = new TabInfo("Listor", "lists", 1);

	constructor(props) {
		super(props);
		this.state = { classGroups: [], divisionGroups: [] }
	}

	componentDidMount() {
		this.fire(this.Events.changeTitle, "Administrera klasser och vapengrupper");
		this.ClassGroups.load(g => this.setState({ classGroups: g }));
		this.DivisionGroups.load(g => this.setState({ divisionGroups: g }));
	}

	selectedText() {
		if (!this.state.selected) return "";
		if (this.state.selected.classes) return this.state.selected.classes.join("\n");
		if (this.state.selected.divisions) return this.state.selected.divisions.join("\n");
		return "";
	}

	drag = (e, item) => {
		e.dataTransfer.setData(item.listName, item.id.toString());
	}

	allowDrop = (e, item) => {
		if (e.dataTransfer.getData(item.listName) !== undefined)
			e.preventDefault();
	}

	drop = (e, item) => {
		let data = e.dataTransfer.getData(item.listName);
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
		let newCG = new ClassGroup(this.state.classGroups.filter(g => g.id < 1000).length + 1);
		this.setState({ classGroups: this.state.classGroups.concat([newCG]), selected: newCG, dirty: true });
	}

	addDivisionGroup = () => {
		let newDG = new DivisionGroup(this.state.divisionGroups.filter(g => g.id < 1000).length + 1);
		this.setState({ divisionGroups: this.state.divisionGroups.concat([newDG]), selected: newDG, dirty: true });
	}

	updateProperty = (name, val) => {
		this.setState({
			classGroups: this.state.classGroups.map(cg => {
				if (cg === this.state.selected) {
					cg[name] = val;
				}
				return cg;
			}),
			divisionGroups: this.state.divisionGroups.map(dg => {
				if (dg === this.state.selected) {
					dg[name] = val;
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
					<div className="add item" onClick={this.addClassGroup}><button className="button-add small" /><p className="add">Skapa ny lista</p></div>
				</div>
				{this.state.selected && <div className="detail">
					<input className="textbox-name" value={this.state.selected.description} onChange={e => this.updateProperty("description", e.target.value)} />
					<input className="textbox-header" value={this.state.selected.header || ""} placeholder="Rubrik" onChange={e => this.updateProperty("header", e.target.value)} />
					<textarea rows="20" cols="50" multiline="true" value={this.selectedText()} onChange={this.updateText} />
				</div>}
				<div>
					<h3>Vapengruppsindelningar</h3>
					{this.state.divisionGroups.map(dg => this.renderGroup(dg))}
					<div className="add item" onClick={this.addDivisionGroup}><button className="button-add small" /><p className="add">Skapa ny lista</p></div>
				</div>
			</div>
		</div>;
	}
}