DOCUMENTATION
BGX is a front end state and view management library inspired by react and redux. Where those libraries are considered javascript frameworks, however, BGX is more of a decorator. BGX does not insist on controlling the whole DOM -- it only wants to make certain nodes with a bgx-map attribute responsive. This allows it to jump into a project with a lot of legacy code and make an impact right away, without having to download a dozen dependencies or bloat the package size. Here's how it works:

DOM action => bgx.fire('EVENT_NAME', { 'EVENT_NAME_2': ['ar', 'gu', 'ments'] });
					 => bgx.execute('EVENT_NAME')
					 => bgx.setState({ nextState: 'nextState' })
					 => bgx.subscriptions
					 => bgx.update()

BGX-STATE
BGX stores the app state in a plain javascript object called bgx.state. This global object should be the single source of truth for your app's view layer -- or the part of the view layer that bgx is responsible for. DOM events such as clicks, drags, keyups, and form submits will call bgx.fire(), giving a list of events (or event objects) whose names correspond to functions defined in the bgx.dispatcher.

BGX-EVENT
An event is simply a user-defined function that modifies the bgx.state in some way by calling the bgx.setState() method. The bgx.setState method will modify the state object, and then queue updates for the dom nodes that take data from that part of the state.

BGX-MAP
BGX will track DOM nodes with the property bgx-map by giving them a unique id and storing references to them in a library, bgx.dom. The bgx-map attribute should be a JSON parseable object whose keys represent attribute names of the DOM node and whose values represent slices of the bgx.state object. When bgx hydrates the DOM, the values of the bgx-map determine what parts of the bgx.state object that the dom element is subscribed to. Whenever that portion of state is changed with bgx.setState, the subscribed DOM nodes are automatically updated.

BGX-UPDATE
Sometimes a map of the variable's attributes is not flexible enough to handle updating the dom node. In this case, dom nodes with a specified bgx-update attribute can provide custom functions that update the dom node or its children.  
