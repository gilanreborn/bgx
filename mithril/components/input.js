import { addTodo, updateTodoInput } from '/actions/actions.js';

const Input = {
	updateInput: function (e) {
		var val = e.target.value;
		if (e.which === 13) { addTodo(val); }
		updateTodoInput(e);
	},
	view: function (v) {
		const { todoInput } = window.store.state;
		return m('input', {
			onkeyup: this.updateInput,
			value: todoInput
		}, todoInput);
	}
};

export { Input };