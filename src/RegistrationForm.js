import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { ParticipantDefinition } from './Participant';
import { RegistrationHeader } from './RegistrationHeader';
import { RegistrationRows } from './RegistrationRows';

export class RegistrationForm extends Component {
    render() {
        return (
            <div id='registration'>
                <table>
                    <RegistrationHeader columns={ParticipantDefinition.getHeaders()} />
                    <RegistrationRows columns={ParticipantDefinition.getHeaders()} registration={this.props.registration}/>
                </table>
                <input type='button' onClick={this.props.registration.addParticipant} value='Lägg till deltagare' />
            </div>
        );
    }
}