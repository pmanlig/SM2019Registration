import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { AutoInjector } from './logic/Injector.js';
import * as components from './components';
import * as models from './models';
import * as logic from './logic';
import * as views from './views';
import { App } from './App';

var injector = new AutoInjector();

injector.registerModule(components);
injector.registerModule(models);
injector.registerModule(logic);
injector.registerModule(views);
injector.register(App);

// ToDo: Implement method registration
let eb = injector.EventBus;
let fire = eb.fire.bind(eb);
let subscribe = eb.subscribe.bind(eb);
fire.register = { name: "fire" };
subscribe.register = { name: "subscribe" };
injector.register(fire);
injector.register(subscribe);

injector.inject();

ReactDOM.render(<injector.App />, document.getElementById('root'));
registerServiceWorker();
