class VNode {
	constructor(options = { type: 'div' }) {
		this._ = options;
		this._node = document.createElement(options.type);
		Object.assign(this, options);
	}

	set id(str) {
		this._id = str;
		this._node.id = str;
	}
	get id() { return this._id; }

	set class(str) {
		this._node.classList = str;
	}
	get class() { return this._node.classList; }

	set children(arr) {
		this._children = arr;
		while (this._node.firstChild) { this._node.firstChild.remove(); }
		debugger;
		arr.forEach(child => this._node.appendChild(child.node));
	}
	get children() { return this._children; }

	set on(param) {
		debugger;
	}

	toString() {
		return this._node;
	}
}