import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AppInjector, Components } from './AppInjector';
import registerServiceWorker from './registerServiceWorker';

var injector = new AppInjector();
const App = injector.inject(Components.App);
console.log(App);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
