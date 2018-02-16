import { todosReducer } from '/reducers/todos.js';
import { todoInputReducer } from '/reducers/todoInput.js';
import { combineReducers } from '/reduxLite/reduxLite.js';

const rootReducer = combineReducers({
	todos: todosReducer,
	todoInput: todoInputReducer,
});

export { rootReducer };