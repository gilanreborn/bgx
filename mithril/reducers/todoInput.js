const initialState = '';

const todoInputReducer = function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'UPDATE_TODO_INPUT':
			var { keyCode, value } = payload;
			return keyCode === 13 ? '' : value;
		default: return state;
	}
};

export { todoInputReducer };