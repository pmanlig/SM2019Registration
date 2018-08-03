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

testInjector.registerModule(components);
testInjector.registerModule(models);
testInjector.registerModule(logic);
testInjector.registerModule(views);
testInjector.register(App);

// ToDo: Implement method registration
let eb = testInjector.EventBus;
let fire = eb.fire.bind(eb);
let subscribe = eb.subscribe.bind(eb);
fire.register = {name: "fire"};
subscribe.register = {name: "subscribe"};
testInjector.register(fire);
testInjector.register(subscribe);

testInjector.inject();

ReactDOM.render(<testInjector.App injector={injector} inject={injector.inject} fire={injector.fire} subscribe={injector.subscribe} />, document.getElementById('root'));
registerServiceWorker();
