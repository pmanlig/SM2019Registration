import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppInjector } from './AppInjector';
import registerServiceWorker from './registerServiceWorker';
import { TestInjector } from './logic/Injector.js';
import * as components from './components';
import * as models from './models';
import { App } from './App';

var injector = new AppInjector();

var testInjector = new TestInjector();
testInjector.registerModule(components);
testInjector.registerModule(models);
testInjector.register(App);
testInjector.inject();

ReactDOM.render(<testInjector.App injector={injector} inject={injector.inject} fire={injector.fire} subscribe={injector.subscribe} />, document.getElementById('root'));
registerServiceWorker();
