(function bgx() {
	var $ = function(arg) { return document.querySelectorAll(arg); }; // jQuery lite ;)
	var bgx = window.bgx = window.bgx || {};
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

	// intialize
	bgx.init = function (initialState = {}, events = {}, updaters = {}, presets = []) {
		bgx.dom           = {};
		bgx.state         = initialState;
		bgx.dispatcher    = events;
		bgx.subscriptions = {};
		bgx.updaters      = updaters;
		bgx.queue         = new Set();
		bgx.hydrate();
	};
	bgx.dispatch = function(fn, args) {
		bgx.dispatcher[fn] && bgx.dispatcher[fn].apply(event.target, args); // set "this" to the dom element firing the event
	};
	bgx.fire = function() {
		console.time('update'); // benchmarks, woohoo!
		[].map.call(arguments, (arg, i) => {
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
		updates.map(u => bgx.subscriptions[u].forEach(s => bgx.queue.add(s)));
	};
	bgx.update = function() { // async so that multiple state changes trigger only one render;
		bgx.queue.size && window.setTimeout(function() { 
			bgx.queue.forEach(function (bgxId) {
				var el = bgx.dom[bgxId];
				el.update(bgx.state);
			});
			bgx.queue = new Set();
		}, 0);
	};

	// track all elements with bgx attributes
	bgx.hydrate = function(targets = $('[bgx-map]')) {
		[].map.call(targets, el => {
			var bgxId = el.getAttribute('bgx') || (Date.now() + Math.random().toString());
			el.bgxId = bgxId;
			el.map = JSON.parse(el.getAttribute('bgx-map') || '{}');
			var subscriptions = new Set(Object.values(el.map));
			var updater = el.getAttribute('bgx-updater'); // specify name of an update method
			el.update = updater ? bgx.updaters[updater] : function(state) { // default update strategy
				Object.keys(this.map).map(attr => {
					var keys = attr.split('.');
					var values = this.map[attr].split('.');
					var deepKey = keys.slice(-1); 
					var deepThis = keys.slice(0, -1).reduce((o, i) => o[i], this);
					var deepValue = values.reduce((p, j) => p[j], state);
					deepThis[deepKey] = deepValue;
				});
			};
			bgx.dom[bgxId] = el;
			subscriptions && subscriptions.forEach(s => {
				bgx.subscriptions[s] = bgx.subscriptions[s] || new Set();
				bgx.subscriptions[s].add(bgxId);
			});
			el.update(bgx.state);
		});
	}
})();
