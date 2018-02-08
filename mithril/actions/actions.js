var uuid = 1;

const Actions = {
	toggleTodo: (e) => {
		var key = e.target.dataset.key;
		var nextState = state.todos.map(t => t.key == key ? { ...t, done: !t.done } : t);
		state.todos = nextState;
	},
	updateTodoInput: (e) => {
		var val = e.target.value;
		if (e.which === 13) {
			Actions.addTodo(val);
			state.todoInput = '';
		} else {
			state.todoInput = val;
		}
	},
	addTodo: (text) => {
		state.todos = [...state.todos, {
			text,
			done: false,
			key: uuid++
		}];
	},
};

export { Actions };