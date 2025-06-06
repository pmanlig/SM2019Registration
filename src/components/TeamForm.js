import React from 'react';
import { TextInput, Dropdown } from '.';

export class TeamForm extends React.Component {
	constructor(props) {
		super(props);
		let { teamDefs, competition } = props;
		let members = 0, alternates = 0;
		teamDefs.forEach((t, i) => {
			let event = competition.events.find(e => e.id === t.eventId);
			t.description = t.event +
				((event.divisions && t.division !== undefined) ? ` - ${t.division}` : "") +
				((event.classes && t.class !== undefined) ? ` - ${t.class}` : "");
			t.id = i;
			if (t.members > members) { members = t.members; }
			if (t.alternates > alternates) { alternates = t.alternates; }
		});
		this.state = { members: members, alternates: alternates }
	}

	updateTeamDef = (team, val) => {
		let { teams, teamDefs } = this.props;
		let def = teamDefs[parseInt(val, 10)];
		teams[team].teamDef = val;
		teams[team].event = def.eventId;
		teams[team].index = def.index;
		teams[team].team_definition_id = def.id;
		this.setState({});
	}

	updateTeamName = (team, value) => {
		let { teams } = this.props;
		teams[team].name = value;
		this.setState({});
	}

	updateMember = (team, member, value) => {
		let { teams } = this.props;
		value = parseInt(value, 10);
		value = value === 0 ? undefined : value;
		teams[team].members[member] = value;
		this.setState({});
	}

	updateAlternate = (team, alternate, value) => {
		let { teams } = this.props;
		value = parseInt(value, 10);
		value = value === 0 ? undefined : value;
		teams[team].alternates[alternate] = value;
		this.setState({});
	}

	Header = props => {
		let { members, alternates } = this.state;
		let hdr = [
			<div key="th1" className='registration-header major-header' style={{ gridColumnEnd: "span 2" }}>Lag&nbsp;<span className="super">(* = obligatoriskt fält)</span></div>,
			<div key="th2" className='registration-header major-header' style={{ gridColumnEnd: `span ${members + alternates}` }}>Medlemmar</div>,
			<div key="d1" style={{ gridRow: 1 }} />,
			<div key="th3" className='team-name-header minor-header'>Lagnamn*</div>,
			<div key="th4" className='team-selection-header minor-header'>Grupp</div>
		];
		for (let i = 0; i < members;) {
			hdr.push(<div key={`tm-${i}`} className='team-member-header minor-header'>{`Skytt ${++i}*`}</div>);
		}
		for (let i = 0; i < alternates;) {
			hdr.push(<div key={`ta-${i}`} className='team-member-header minor-header'>{`Reserv ${++i}`}</div>);
		}
		hdr.push(<div key="d2" style={{ gridRow: 2 }} />); // delete button
		return hdr;
	}

	TeamRow = props => {
		let { members, alternates } = this.state;
		let { teamDefs, competition } = this.props;
		let participants = this.props.participants || [];
		let { team, index } = props;
		let teamDef = teamDefs[team.teamDef || 0];
		let event = competition.events.find(e => e.id === teamDef.eventId);
		participants = participants.filter(p => p.eventId === teamDef.eventId);
		if (event.divisions && teamDef.division !== undefined) { participants = participants.filter(p => p.division === teamDef.division); }
		if (event.classes && teamDef.class !== undefined) { participants = participants.filter(p => p.class === teamDef.class); }
		participants = participants.map(p => ({ id: p.id, description: p.name }));
		let row = [
			<div key={`team-${index}`} className="team-header">{`Lag ${index}`}</div>,
			<TextInput id={`team-name-${index}`} key={`team-name-${index}`} name="Lagnamn" placeholder="Lagnamn" value={team.name} onChange={e => this.updateTeamName(index, e.target.value)} />,
			<Dropdown id={`team-selection-${index}`} key={`team-selection-${index}`} name="Lag" placeholder="Lag" value={team.teamDef || 0} list={teamDefs} onChange={e => this.updateTeamDef(index, e.target.value)} />,
		];
		for (let i = 0; i < members; i++) {
			let id = `member-${index}-${i}`;
			if (i < teamDef.members) {
				let name = `Skytt ${i + 1}`;
				let selected = team.members[i];
				if (isNaN(selected) || selected === undefined) { selected = 0; }
				let list = [{ id: 0, description: "Ingen", empty: true }].concat(participants.filter(p => p.id === team.members[i] || (!team.members.includes(p.id) && !team.alternates.includes(p.id))));
				row.push(<Dropdown id={id} key={id} name={name} placeholder={name}
					value={selected} list={list} onChange={e => this.updateMember(index, i, e.target.value)} />);
			} else {
				row.push(<div key={id} />);
			}
		}
		for (let i = 0; i < alternates; i++) {
			let id = `alt-${index}-${i}`;
			let selected = team.alternates[i];
			if (isNaN(selected) || selected === undefined) { selected = 0; }
			let list = [{ id: 0, description: "Ingen", empty: true }].concat(participants.filter(p => p.id === team.alternates[i] || (!team.members.includes(p.id) && !team.alternates.includes(p.id))));
			if (i < teamDef.alternates) {
				let name = `Reserv ${i + 1}`;
				row.push(<Dropdown id={id} key={id} name={name} placeholder={name}
					value={selected} list={list} onChange={e => this.updateAlternate(index, i, e.target.value)} />);
			} else {
				row.push(<div key={id} />);
			}
		}
		row.push(<button key={`del-${index}`} style={{ margin: "2px 5px 0 0" }} className="button button-close small red" onClick={e => this.props.onDelete(index)} />);
		return row;
	}

	render() {
		let { teams } = this.props;
		return <div className="content team-registration-form">
			<this.Header />
			{teams.map((t, n) => <this.TeamRow key={n} team={t} index={n} />)}
		</div>
	}
}