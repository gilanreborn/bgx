import { Actions } from '../actions/actions.js';

const Todo = {
	view: function (v) {
		const { done, key, text } = v.attrs;
		const props = {
			class: done ? 'done' : 'todo',
			onclick: Actions.toggleTodo,
			key: key,
			'data-key': key,
		};
		return m('li', props, text);
	}
};

export { Todo };