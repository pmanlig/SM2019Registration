import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { RegistrationForm } from './RegistrationForm';
import { Summary } from './Summary';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { registration: [], };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <RegistrationForm registration={this.state.registration} />
        <Summary registration={this.state.registration} />
      </div>
    );
  }
}

export default App;
