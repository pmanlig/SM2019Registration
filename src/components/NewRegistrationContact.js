import './RegistrationContact.css';
import React from 'react';
import { TextInput, ClubSelectorInput } from '../components';

export class NewRegistrationContact extends React.Component {
	static register = { name: "NewRegistrationContact" };

	render() {
		return <div id='registration-contact' className='content'>
			<div className='registration-header'>Anmälare&nbsp;<span style={{ fontSize: "x-small", verticalAlign: "top" }}>(* = obligatoriskt fält)</span></div>
			<div className="registration-contact-inputs">
				<TextInput name="Namn*" id="name" placeholder="Namn" value={this.props.name} onChange={e => this.props.onChange(e.target.value, null, null)} />
				<ClubSelectorInput name="Förening*" id="organization" placeHolder="Förening" width="200px" value={this.props.organization} onChange={e => this.props.onChange(null, e.target.value, null)} />
				<TextInput name="Email*" id="email" placeholder="Email" value={this.props.email} onChange={e => this.props.onChange(null, null, e.target.value)} />
				{/* this.Competition.rules.includes("show-acct") && <this.TextInput name="Konto" id="account" placeholder="Kontonummer" width="100" /> */}
			</div>
		</div>;
	}
}