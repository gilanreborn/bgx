(function() {
	var $ = function(arg) { return document.querySelectorAll(arg); }; // jQuery lite ;)
	var bgx = window.bgx = window.bgx || function g(element, ...args) {
		var el;
		var selector = {}; 
		if (typeof element === 'string') { // make a new element;
			selector = bgxSelectorParser(element);
			el = {};
			Object.assign(el, selector);
			el.bgxId = bgx.uuid++;
		} else { // wrap or mutate an existing element;
			el = element;
		}
		const argTypes = {
			array: arr => el.children = arr,
			object: obj => el = Object.assign(el, obj),
			string: str => el.innerText = str,
		};
		args.map(arg => {
			argType = Array.isArray(arg) ? 'array' : (typeof arg);
			argTypes[argType] && argTypes[argType](arg);
		});
		return new VNode(el);
	};

	// utility functions:
	function index(obj, keys, value) {
		var key = keys.shift();
		if ( keys.length ) {
			return index(obj[key], keys, value)
		} else {
			return obj[key] = value;
		}
	}
	function keyStrings(obj) {
		if ( !obj ) { return obj; } // in case we find null or undefined in our obj
		return Object.keys(obj).reduce((acc, key) => {
			if ( obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key]) ) {
				return acc.concat(keyStrings(obj[key]).map(deepKey => key + "." + deepKey));
			} else {
				return acc.concat(key);
			}
		}, []);
	}
	function bgxComponent(el, options) { // factory function
		return Object.assign({}, { el }, options);
	}
	function bgxSelectorParser(string) {
		const tokens = { '#': 'id', '.': 'classList' }
		var result = { type: [], id: [], classList: [] };
		var target = 'type';
		var current = '';
		for (let char of string) {
			if ( tokens[char] ) {
				result[target].push(current);
				target = tokens[char];
				current = '';
			} else {
				current += char;
			}
		}
		result[target].push(current);
		'type id classList'.split(' ').forEach(key => result[key] = result[key].join(' '));
		return result;
	}

	// intialize
	bgx.init = function(
		initialState = {}, 
		events = {}, 
		components = {}, 
		presets = [], 
		autohydrate = false,
	) {
		bgx.globalEvents  = false;
		bgx.uuid          = bgx.uuid || 0;
		bgx.dom           = {};
		bgx.state         = initialState;
		bgx.dispatcher    = events;
		bgx.subscriptions = {};
		bgx.components    = components;
		bgx.queue         = new Set();
		autohydrate && bgx.hydrate();
	};
	bgx.dispatch = function(fn, args) {
		bgx.dispatcher[fn] && bgx.dispatcher[fn].apply(event.target, args); // set "this" to the dom element firing the event
	};
	bgx.fire = function(...args) {
		console.time('update'); // benchmarks, woohoo!
		args.map((arg, i) => {
			if ( typeof arg === 'string' ) {
				bgx.dispatch(arg);
			} else if ( typeof arg === 'object' ) {
				Object.keys(arg).map(fn => bgx.dispatch(fn, arg[fn]));
			}
		});

		bgx.update();
		console.timeEnd('update');
	};
	bgx.setState = function(nextState) {
		var updates = keyStrings(nextState);
		bgx.state = Object.assign({}, bgx.state, nextState);
		bgx.viewState = {};
		updates.map(u => bgx.subscriptions[u].forEach(s => bgx.queue.add(s)));
	};
	bgx.update = function() { // async so that multiple state changes trigger only one render;
		bgx.queue.size && window.setTimeout(function() { 
			bgx.queue.forEach(function (bgxId) {
				var el = bgx.dom[bgxId];
				el.update(bgx.state);
			});
			bgx.queue = new Set();
			window.event = undefined;
		}, 0);
	};


	// track all elements with bgx attributes
	bgx.hydrate = function(targets = $('[bgx], [bgx-map], [bgx-component]')) {
		console.time('hydrate');
		[...targets].map(el => {
			el.bgxId = el.getAttribute('bgx') || bgx.uuid++;
			var component = el.getAttribute('bgx-component');
			if (component) { 
				el.component = bgxComponent(el, bgx.components[component]) 
			};
			el.map = JSON.parse(el.getAttribute('bgx-map') || '{}');
			setUpdater(el);
			setSubscriptions(el);
			requireGlobalEvents(el);
			bgx.dom[el.bgxId] = el;
			el.update(bgx.state);
		});
		console.timeEnd('hydrate');
	}

	// hydration helpers:
	function genericUpdater(state) { // default update strategy
		Object.keys(this.map).map(attr => {
			var keys      = attr.split('.');
			var values    = this.map[attr].split('.');
			var deepKey   = keys.slice(-1); 
			var deepThis  = keys.slice(0, -1).reduce((o, i) => o[i], this);
			var deepValue = values.reduce((p, j) => p[j], state);
			deepThis[deepKey] = deepValue;
		});
	};
	
	function requireGlobalEvents(el) {
		if ( !bgx.globalEvents ) {
			[].map.call(el.attributes, prop => {
				if ( prop.name.slice(0, 2) === 'on' && typeof el[prop.name] === 'function' ) {
					var oldFn = el[prop.name];
					el[prop.name] = function(event) {
						window.event = event;
						oldFn(event);
					};
				}
			});
		}
	}

	function setUpdater(el) {
		el.update = el.component ? function(state) { el.component.update({ el, state }); } : genericUpdater;
	}

	function setSubscriptions(el) {
		var componentLevelSubs = [];
		if ( el.component ) {
			componentLevelSubs = el.component.subscriptions || [];
		}
		var subscriptions = new Set([
			...Object.values(el.map),
			...componentLevelSubs,
		]);
		subscriptions && subscriptions.forEach(s => {
			bgx.subscriptions[s] = bgx.subscriptions[s] || new Set();
			bgx.subscriptions[s].add(el.bgxId);
		});
	}
})();
