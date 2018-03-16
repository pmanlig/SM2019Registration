import React, { Component } from 'react';
import { RegistrationDefinition } from './RegistrationDefinition';
import { RegistrationHeader } from './RegistrationHeader';
import { RegistrationRows } from './RegistrationRows';

export class RegistrationForm extends Component {
    /*
    getDivisionCheckboxes
    
    constructor() {

    }
    */

    addRegistrant() {
        this.props.registration.push();
    }

    render() {
        return (
            <div id='registration'>
                <table>
                    <RegistrationHeader columns={RegistrationDefinition.getRegistrationHeaders()} />
                    <RegistrationRows columns={RegistrationDefinition.getRegistrationHeaders()} />
                </table>
                <input type='button' onClick={this.addRegistrant.bind(this)} value='Lägg till deltagare' />
            </div>
        );
    }
}