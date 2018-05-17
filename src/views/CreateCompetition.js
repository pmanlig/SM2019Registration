import React from 'react';
import { Events, InjectedComponent } from '../logic';

export class CreateCompetition extends InjectedComponent {
	componentDidMount() {
		this.fire(Events.changeTitle, "Skapa ny tävling");
	}

  render() {
		return <h2>Skapa ny tävling</h2>;
	}	
}