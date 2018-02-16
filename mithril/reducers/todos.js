const initialState = [
	{ text: 'I am the very model', done: false, key: 0 },
	{ text: 'of a modern web developer', done: false, key: 1 },
];
var uuid = 2;

const todosReducer = function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'TOGGLE_TODO':
			var { key } = payload;
			return state.map(t => t.key == key ? { ...t, done: !t.done } : t);
		case 'ADD_TODO':
			var { text } = payload;
			var newTodo = { text, done: false, key: uuid++ };
			return [ ...state, newTodo ];
		default: return state;
	}
}

export { todosReducer };