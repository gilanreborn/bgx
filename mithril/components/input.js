import { Actions } from '../actions/actions.js';

const Input = {
	view: function () {
		return m('input', {
			onkeyup: Actions.updateTodoInput,
			value: state.todoInput
		}, state.todoInput);
	}
};

export { Input }