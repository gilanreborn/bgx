import {Todo} from './components/todo.js';
import {Input} from './components/input.js';
import {Actions} from './actions/actions.js';

var root = document.querySelector('#root');
var jsn = root.getAttribute('data-mith');
var initialState = JSON.parse(jsn);
var state = window.state = initialState;

const Todos = {
	view: function (vnode) {
		const todos = state.todos.map((t, i) => m(Todo, t));
		return m('main', [
			m(Input),
			m('ul', 'TODOs:', todos),
			m('div.preview', state.todoInput),
		]);
	}
};

m.mount(root, Todos);