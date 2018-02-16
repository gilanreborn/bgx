import { dispatcher } from '/reduxLite/reduxLite.js';

export const toggleTodo = (e) => {
	var key = e.target.dataset.key;
	var action = { 
		type: 'TOGGLE_TODO',
		payload: { key },
	};
	dispatcher.fire(action);
};

export const updateTodoInput = (e) => {
	var value = e.target.value;
	var keyCode = e.which;
	var action = {
		type: 'UPDATE_TODO_INPUT',
		payload: { keyCode, value },
	};
	dispatcher.fire(action);
};

export const addTodo = (text) => {
	var action = {
		type: 'ADD_TODO',
		payload: { text },
	};
	dispatcher.fire(action);
};