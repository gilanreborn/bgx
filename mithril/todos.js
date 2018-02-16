import { createStore } from '/reduxLite/reduxLite.js';
import { rootReducer } from '/reducers/root.js';
import { Todo } from '/components/todo.js';
import { Input } from '/components/input.js';

var root = document.querySelector('#root');
var jsn = root.getAttribute('data-mith');
var initialState = JSON.parse(jsn);

var store = createStore(rootReducer);

const Todos = {
	view: function (vnode) {
		const { todoInput, todos } = window.store.state;
		const todosList = todos.map((t, i) => m(Todo, t));
		return m('main', [
			m(Input),
			m('ul.todos', 'TODOs:', todosList),
			m('div.preview', todoInput),
		]);
	}
};



m.mount(root, Todos);