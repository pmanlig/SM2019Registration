import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { ParticipantDefinition, Prefixes, createTagId } from './Participant';

function RegistrationHeader(props) {
    const majorHeaders = [];
    const minorHeaders = [];
    var first = true;
    var counter = 0;
    props.columns.forEach((column) => {
        majorHeaders.push(<th key={majorHeaders.length} className="major" colSpan={column.subfields.length}>{column.name}</th>);
        column.subfields.forEach((minor) => {
            if (first)
                minorHeaders.push(<th key={counter++} style={{ width: minor.width, paddingRight: 10 }} className="minor">{minor.name}</th>);
            else
                minorHeaders.push(<th key={counter++} className="minor vert"><div>{minor.name}</div></th>);
        });
        first = false;
    });
    return (
        <thead>
            <tr>{majorHeaders}</tr>
            <tr>{minorHeaders}</tr>
        </thead>
    );
}

function RegistrationCheckboxes(props) {
    let info = props.participant.registrationInfo;
    let result = [];
    for (let i = 0; i < info.length; i++) {
        result.push(<td key={i}><input type="checkbox" onChange={(e) => { props.registration.setDivision(props.participant.id, i, e.target.value) }} checked={info[i]} /></td>);
    }
    return result;
}

function RegistrationRow(props) {
    const myId = props.participant.id;
    return <tr key={props.participant.id}>
        <td className="left"><input type="text" value={props.participant.name}
         onChange={e => {props.registration.setParticipantName(myId, e.target.value)}} /></td>
        <td className="left"><input type="text" size="5" style={{ width: '40px' }} value={props.participant.competitionId}
            onChange={e => { props.registration.setParticipantCompetitionId(myId, e.target.value) }} /></td>
        <td className="left"><input type="text" id={createTagId(Prefixes.organization, myId)} value={props.participant.organization} onChange={props.registration.setParticipantOrganization} /></td>
        {RegistrationCheckboxes(props)}
        <td><button onClick={(e) => props.registration.deleteParticipant(props.participant.id)}>X</button></td></tr>;
}

function RegistrationRows(props) {
    return <tbody>{props.registration.participants.map(
        participant => <RegistrationRow key={participant.id} columns={props.columns} registration={props.registration} participant={participant} />
    )}</tbody>;
}

export class RegistrationForm extends Component {
    render() {
        return (
            <div id='registration'>
                <table>
                    <RegistrationHeader columns={ParticipantDefinition.getHeaders()} />
                    <RegistrationRows columns={ParticipantDefinition.getHeaders()} registration={this.props.registration} />
                </table>
                <div className="left">
                    <input type='button' className="toolButton" id="addButton" onClick={this.props.registration.addParticipant} value='Lägg till deltagare' />
                    <input type='button' className="toolButton" id="registerButton" onClick={this.props.registration.register} value='Registrera' />
                </div>
            </div>
        );
    }
}