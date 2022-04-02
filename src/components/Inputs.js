import './Inputs.css';
import './RegistrationContact.css';
import React from "react";

function maskOK(mask, value) {
	if (mask === undefined) { return true; }
	for (let i = 0; i < value.length; i++) {
		if (!mask.includes(value[i])) { return false; }
	}
	return true;
}

export function TextInput(props) {
	return <div id={`input-${props.id}`} className="input-wrapper">
		<label htmlFor={props.id}>{props.name}</label>
		<input type="text" {...props} onChange={e => maskOK(props.mask, e.target.value) && props.onChange(e)} />
	</div>
}

export class ClubSelectorInput extends React.Component {
	static wire = ["ClubSelector"];

	render() {
		return <div id={`input-${this.props.id}`} className="input-wrapper">
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<this.ClubSelector {...this.props} />
		</div>
	}
}

export function NewRegistrationContact(props) {
	return <div id='registration-contact' className="content">
		<div className='registration-header'>Anmälare&nbsp;<span className="super">(* = obligatoriskt fält)</span></div>
		<div className="registration-contact-inputs">
			<TextInput name="Namn*" id="name" placeholder="Namn" value={props.name} onChange={e => props.onChange("name", e.target.value)} />
			<ClubSelectorInput name="Förening*" id="organization" placeholder="Förening" value={props.organization} onChange={e => props.onChange("organization", e.target.value)} />
			<TextInput name="Email*" id="email" placeholder="Email" value={props.email} onChange={e => props.onChange("email", e.target.value)} />
			{props.showAccount && <TextInput name="Konto" id="account" placeholder="Kontonummer" value={props.account} mask="0123456789-" onChange={e => props.onChange("account", e.target.value)} />}
		</div>
	</div>;
}