import React from 'react';
import { TextInput, Dropdown } from '.';
import { Status } from '../models';

export class GroupProperties extends React.Component {
	render() {
		let { icons, selected, onChange } = this.props;
		icons = icons ? ["Ingen"].concat(Object.keys(icons)) : ["Ingen"];
		let status = [{ id: Status.Hidden, description: "Gömd" }, { id: Status.Open, description: "Synlig" }];
		if (selected === undefined) { return null; }
		return <div id="group-props">
			<div className="group-header">
				<TextInput name="Gruppnamn" id="group-name" placeholder="Namn" value={selected.name} onChange={e => onChange(selected, "name", e.target.value)} />
			</div>
			<TextInput name="ID" id="group-id" placeholder="ID" value={selected.label} onChange={e => onChange(selected, "label", e.target.value)} />
			<TextInput name="Beskrivning" id="group-desc" placeholder="Beskrivning" value={selected.description} onChange={e => onChange(selected, "description", e.target.value)} />
			<Dropdown name="Ikon" id="group-icon" placeholder="Ingen" value={selected.icon} list={icons} onChange={e => onChange(selected, "icon", e.target.value)} />
			<TextInput name="Textfärg" id="group-color" placeholder="#000000" value={selected.color} onChange={e => onChange(selected, "color", e.target.value)} />
			<TextInput name="Bakgrundsfärg" id="group-background" placeholder="#FFFFFF" value={selected.background} onChange={e => onChange(selected, "background", e.target.value)} />
			<Dropdown name="Status" id="group-status" placeholder="Synlig" value={selected.status} list={status} onChange={e => onChange(selected, "status", parseInt(e.target.value, 10))} />
		</div>
	}
}