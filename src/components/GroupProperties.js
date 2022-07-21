import React from 'react';
import { TextInput } from '.';

export class GroupProperties extends React.Component {
	render() {
		let { group, onChange } = this.props;
		if (group === undefined) { return null; }
		return <div id="group-props">
			<div className="group-header">
				<TextInput name="Gruppnamn" id="group-name" placeholder="Namn" value={group.name} onChange={e => onChange(group, "name", e.target.value)} />
			</div>
			<TextInput name="ID" id="group-id" placeholder="ID" value={group.label} onChange={e => onChange(group, "label", e.target.value)} />
			<TextInput name="Beskrivning" id="group-desc" placeholder="Beskrivning" value={group.description} onChange={e => onChange(group, "description", e.target.value)} />
			<TextInput name="Ikon" id="group-icon" placeholder="Ikon" value={group.icon} onChange={e => onChange(group, "icon", e.target.value)} />
			<TextInput name="Textfärg" id="group-color" placeholder="#000000" value={group.color} onChange={e => onChange(group, "color", e.target.value)} />
			<TextInput name="Bakgrundsfärg" id="group-background" placeholder="#FFFFFF" value={group.background} onChange={e => onChange(group, "background", e.target.value)} />
		</div>
	}
}