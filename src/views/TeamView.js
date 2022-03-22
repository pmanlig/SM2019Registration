import './TeamView.css';
import React from 'react';
import { TextInput } from '../components';

export class TeamView extends React.Component {
	static register = { name: "TeamView" };
	static wire = ["EventBus", "Events", "Server", "Competition", "Footers", "NewRegistrationContact"];

	constructor(props) {
		super(props);
		this.state = { name: "", organization: "", email: "" };
	}

	onChange = (name, organization, email) => {
		this.setState({
			name: name || this.state.name,
			organization: organization || this.state.organization,
			email: email || this.state.email
		});
	}

	TeamForm = props => {
		let teams = [1, 2, 3];
		return <div id='team-registration-form' className='content' style={{ gridTemplateColumns: `repeat(7, auto)` }}>
			<div className='registration-header major-header'>Lag&nbsp;<span style={{ fontSize: "x-small", verticalAlign: "top" }}>(* = obligatoriskt fält)</span></div>
			<div className='registration-header major-header' style={{ gridColumnEnd: "span 6" }}></div>
			<div className='team-name-header minor-header'>Lagnamn*</div>
			<div className='team-member-header minor-header'>Skytt 1*</div>
			<div className='team-member-header minor-header'>Skytt 2*</div>
			<div className='team-member-header minor-header'>Skytt 3*</div>
			<div className='team-member-header minor-header'>Reserv 1</div>
			<div className='team-member-header minor-header'>Reserv 2</div>
			<div className='team-member-header minor-header'>Reserv 3</div>
			{teams.flatMap(n => [
				<div key={`team-${n}`} className="team-name">{`Lag ${n}`}</div>,
				<TextInput id={`team-name-${n}`} key={`team-header-${n}`} name="Lagnamn" placeholder="Lagnamn" style={{ gridRow: n + 2 }} />,
				<TextInput id={`member-${n}-1`} key={`member-${n}-1`} name="Skytt 1" placeholder="Skytt 1" style={{ gridRow: n + 2 }} />,
				<TextInput id={`member-${n}-2`} key={`member-${n}-2`} name="Skytt 2" placeholder="Skytt 2" style={{ gridRow: n + 2 }} />,
				<TextInput id={`member-${n}-3`} key={`member-${n}-3`} name="Skytt 3" placeholder="Skytt 3" style={{ gridRow: n + 2 }} />,
				<TextInput id={`reserve-${n}-1`} key={`reserve-${n}-1`} name="Reserv 1" placeholder="Reserv 1" style={{ gridRow: n + 2 }} />,
				<TextInput id={`reserve-${n}-2`} key={`reserve-${n}-2`} name="Reserv 2" placeholder="Reserv 2" style={{ gridRow: n + 2 }} />,
				<TextInput id={`reserve-${n}-3`} key={`reserve-${n}-3`} name="Reserv 3" placeholder="Reserv 3" style={{ gridRow: n + 2 }} />
			])}
		</div>
	}

	render() {
		let { name, organization, email } = this.state;
		return <div className="content">
			<this.NewRegistrationContact name={name} organization={organization} email={email} onChange={this.onChange} />
			<this.TeamForm />
		</div>;
	}
}