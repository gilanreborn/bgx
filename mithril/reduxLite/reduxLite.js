// REDUX LITE:

const combineReducers = obj => {
	return function (state, action) {
		let nextState = {};
		Object.keys(obj).map(key => {
			if ( state ) {
				nextState[key] = obj[key](state[key], action);
			} else {
				// handle init:
				nextState[key] = obj[key](undefined, {});
			}
		});
		return nextState;
	}
};

const dispatcher = {
	fire: action => {
		store.state = store.rootReducer(store.state, action);
	}
};

const createStore = rootReducer => {
	var store = window.store = {
		rootReducer,
		dispatcher,
		state: rootReducer(),
		dispatch: dispatcher.fire,
	};
	return store;
};

export {
	combineReducers,
	dispatcher,
	createStore,
};
