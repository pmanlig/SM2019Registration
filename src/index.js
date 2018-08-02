import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppInjector } from './AppInjector';
import registerServiceWorker from './registerServiceWorker';
import { AutoInjector } from './logic/Injector.js';
import * as components from './components';
import * as models from './models';
import * as logic from './logic';
import * as views from './views';
import { App } from './App';

var injector = new AppInjector();
var testInjector = new AutoInjector();

// ToDo: remove last
injector.fire.register = { name: "fire" };
injector.subscribe.register = { name: "subscribe" };
testInjector.register(injector.fire);
testInjector.register(injector.subscribe);

testInjector.registerModule(components);
testInjector.registerModule(models);
testInjector.registerModule(logic);
testInjector.registerModule(views);
testInjector.register(App);
testInjector.inject();

ReactDOM.render(<testInjector.App injector={injector} inject={injector.inject} fire={injector.fire} subscribe={injector.subscribe} />, document.getElementById('root'));
registerServiceWorker();
