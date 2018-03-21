import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { ParticipantDefinition } from './Participant';
import {Prefixes, createTagId} from './Person';

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

function RegistrationRow(props) {
    const myId = props.participant.id;
    var fieldId = 0;
    return <tr key={props.participant.id}>
        <td className="left"><input type="text" value={props.participant.name} id={createTagId(Prefixes.name,myId)} onChange={props.registration.setParticipantName} /></td>
        <td className="left"><input type="text" id={createTagId(Prefixes.competitionId, myId)} size="5" style={{ width: '40px' }} value={props.participant.competitionId} onChange={props.registration.setParticipantCompetitionId}/></td>
        <td className="left"><input type="text" id={createTagId(Prefixes.organization, myId)} value={props.participant.organization} onChange={props.registration.setParticipantOrganization} /></td>
        {props.participant.registrationInfo.map((cell) => { return (<td key={fieldId++}><input type="checkbox" checked={cell} /></td>) })}
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
                    <tbody><tr>
                        <td className="left"><input type='button' className="addButton" onClick={this.props.registration.addParticipant} value='Lägg till deltagare' /></td></tr>
                    </tbody>
                </table>
            </div>
        );
    }
}