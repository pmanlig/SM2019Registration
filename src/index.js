import './general/Buttons.css';
import './general/Colors.css';
import './general/Controls.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { AutoInjector } from './logic/Injector.js';
import * as components from './components';
import * as models from './models';
import * as logic from './logic';
import * as views from './views';
import * as test from './test';
import { App } from './App';

let ua = ""; // navigator.userAgent;
if (ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1)
	ReactDOM.render(<div className="content">
		<h2>Webbläsaren stöds inte</h2>
		<p>Internet Explorer saknar tyvärr stöd för den web-teknik som vi använder på sidan, vilket gör att vi i dagsläget inte kan stödja Internet Explorer. Vi rekommenderar i
			 stället <a href="https://www.google.com/chrome/">Google	Chrome</a>,	<a href="https://www.mozilla.org/sv-SE/firefox/new/">Mozilla Firefox</a>, <a href="https://support.apple.com/sv-se/HT204416">Safari</a> eller <a href="https://www.microsoft.com/sv-se/windows/microsoft-edge">Microsoft Edge</a>.</p>
	</div>, document.getElementById('root'));
else {
	window._debug = true;

	var injector = new AutoInjector();

	injector.registerModule(components);
	injector.registerModule(models);
	injector.registerModule(logic);
	injector.registerModule(views);
	injector.registerModule(test);
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
}

registerServiceWorker();