import './Inputs.css';
import './Spinner.css';
import React from "react";

function maskOK(mask, value) {
	if (mask === undefined) { return true; }
	for (let i = 0; i < value.length; i++) {
		if (!mask.includes(value[i])) { return false; }
	}
	return true;
}

export function TextInput(props) {
	return <div className="input-wrapper">
		<label htmlFor={props.id}>{props.name}</label>
		<input type="text" {...props} onChange={e => maskOK(props.mask, e.target.value) && props.onChange(e)} />
	</div>
}

export function Spinner({ className, value, onChange, size }) {
	return <div className="spinner">
		<button className="spinner button-previous" tabIndex="-1" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value - 1)} />
		<input className={"spinner " + className} value={value} size={size || 1} onChange={e => onChange(e.target.value, 10)} />
		<button className="spinner button-next" tabIndex="-1" style={{ backgroundColor: "inherit" }} onClick={e => onChange(value + 1)} />
	</div>;
}

export class ClubSelectorInput extends React.Component {
	static wire = ["ClubSelector"];

	render() {
		return <div className="input-wrapper">
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

export function Dropdown(props) {
	let { placeholder, value, list } = props;
	try {
		list = list.map(li => typeof (li) === "string" ? { id: li, description: li } : li);
		if (placeholder === undefined) {
			let def = list.find(v => v.description.charAt(0) === '!');
			if (def !== undefined) {
				placeholder = def.description.replace(/^!/, "");
			}
		}
		list = list.filter(v => v.description.charAt(0) !== '!');

		if (value === undefined) {
			return <div className="input-wrapper">
				<label htmlFor={props.id}>{props.name}</label>
				<select {...props} className={props.className + " default"} value={"default"} >
					<option className="default" value="default" disabled>{placeholder}</option>
					{list && list.filter(i => !i.empty).map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
				</select></div>;
		}

		return <div className="input-wrapper">
			<label htmlFor={props.id}>{props.name}</label>
			<select {...props}>
				{list && list.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
			</select></div>;
	} catch (e) {
		console.log("ERROR", e);
		console.log("Properties", props);
		return null;
	}
}