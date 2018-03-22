//Author - Austin Ash (2017)

class DiGraph {

	constructor(nodes) {
		this.nodes = nodes || [];
	}
	
	//Getters
	get nodes() {
		return this._nodes;
	}	
	
	//Setters
	set nodes (nodes) {
		//throw error if nodes is not an array
		if (!(nodes instanceof Array)) {
			throw new Error('Nodes must be an Array of Node objects. You gave ' +  typeof nodes);
		}
		//throw error if any element of nodes is not a Node
		for (var i in nodes) {
			if (!(nodes[i] instanceof Node)) {
				throw new Error('At least one element in nodes was not a Node. You gave ' + typeof nodes[i]);
			}
		}
		this._nodes = nodes;
	}
	
	addNode(node) {
		if (!(node instanceof Node)) {
			throw new Error('Cannot add a non-Node to nodes. Syntax: addNode(Node). You gave ' + typeof node);
		}
		if (this.getNode(node.id) !== undefined) {
			throw new Error("A node with the ID '" + node.id + "' already exists in the DiGraph");
		}
		this.nodes.push(node);
		//ToDo
	}
	
	contains(node) {
		return this.nodes.contains(node);
	}
	
	removeNode(node) {
		if (!(this.contains(node))) {
			throw new Error('Could not remove node because it does not exist in the graph');
		}
		for (var i in this.nodes) {
			if (this.nodes[i] === node) {
				this.nodes.splice(i,1);
			}
		}
		return undefined; //this should never be returned
	}
	
	getNode(id) {
		for (var i in this.nodes) {
			if (this.nodes[i].id == id) {
				return this.nodes[i];
			}
		}
		return undefined; //node not found
	}
	
	getNodeByEdge(edge) {
		for (var i in this.nodes) {
			if (this.nodes[i].containsEdge(edge)) {
				return this.nodes[i];
			}
		}
		return undefined; //node not found
	}
	
	getNodeInside(x,y) {
		for (var i=0; i<(this.nodes.length || 0); i++) {
			if (this.nodes[i].isInside(x,y)) {
				return this.nodes[i];
			}
		}
		return null;
	}
	
	getNearbyNode(x,y,d,except) {
		for (var i=0; i<(this.nodes.length || 0); i++) {
			if (this.nodes[i].isPointWithinDistance(x,y,d)) {
				if (this.nodes[i] !== except) {
					return this.nodes[i];
				}
			}
		}
		return null;
	}	
	
	getInitial() {
		for (var i=0; i<(this.nodes.length || 0); i++) {
			if (this.nodes[i].initial) {
				return this.nodes[i];
			}
		}
		return null;
	}
		
	toString(indent) {
		var t = ''; //indents (optional)
		var tNum = indent || 0; //indent number
		var nodes = '';
		for (var i=0; i<(tNum || 0); i++) {
			t += '\t';
		}
		for (var i=0; i<(this.nodes.length || 0); i++) {
			nodes += this.nodes[i].toString(tNum + 1);
			if (i<this.nodes.length-1) {
				nodes += '\n';
			}
		}
		return t + "DiGraph: \n" + nodes;
	}
}

class Node {

	constructor(id, x, y, r, edges, accepting, initial, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.r = r || 40;
		this.edges = edges || [];
		this.accepting = accepting || false;
		this.initial = initial || false;
		this.color = color || "#ffffff";
	}
	
	//Getters
	get id() {
		return this._id;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get r() {
		return this._r;
	}
	get edges() {
		return this._edges;
	}
	get accepting() {
		return this._accepting;
	}
	get initial() {
		return this._initial;
	}
	get color() {
		return this._color;
	}

	//Setters
	set id(id) {
		if (typeof id !== 'string') {
			throw new Error('id must be a string, you gave ' + typeof id );
		}
		this._id = id;
	}
	set x(x) {
		if (typeof x !== 'number') {
			throw new Error('x must be a number, you gave ' + typeof x );
		}
		this._x = x;
	}
	set y(y) {
		if (typeof y !== 'number') {
			throw new Error('y must be a number, you gave ' + typeof y );
		}
		this._y = y;
	}
	set r(r) {
		if (typeof r !== 'number') {
			throw new Error('r must be a number, you gave a ' + typeof r );
		}
		if (r<0) {
			throw new Error('r must be greater than 0, you gave ' + r );
		}
		this._r = r;
	}
	set color(color) {
		if (typeof color !== 'string') {
			throw new Error('color must be a string, you gave ' + typeof color );
		}
		this._color = color;
	}
	set edges(edges) {
		//throw error if edges is not an array
		if (!(edges instanceof Array)) {
			throw new Error('edges must be an Array of Edge objects. You gave ' +  typeof edges);
		}
		//throw error if any element of edges is not a Edge
		for (var i in edges) {
			if (!(edges[i] instanceof Edge)) {
				throw new Error('At least one element in edges was not a Edge. You gave ' + typeof edges[i]);
			}
		}
		this._edges = edges;
	}
	set accepting(accepting) {
		if (typeof accepting !== 'boolean') {
			throw new Error('accepting must be a boolean, you gave ' + typeof accepting);
		}
		this._accepting = accepting;
	}
	set initial(initial) {
		if (typeof initial !== 'boolean') {
			throw new Error('initial must be a boolean, you gave a ' + typeof initial);
		}
		this._initial = initial;
	}
	
	addEdge(edge) {
		if (!(edge instanceof Edge)) {
			throw new Error('addEdge takes an Edge, you gave a ' +  typeof edge);
		}
		if (!(this.containsEdge(edge))) {
			this.edges.push(edge);	
		} else {
			throw new Error('That edge already exists: ' + edge);
		}
	}
	
	containsEdge(edge) {
		for (var i in this.edges) {
			if (this.edges[i].otherNode === edge.otherNode) {
				return true;
			}
		}
		return false;
	}
	
	deleteEdge(edge) {
		if (!(this.containsEdge(edge))) {
			throw new Error('Attempted to delete an edge not contained within the given node');
		}
		var index = this.edges.indexOf(edge);
		this.edges.splice(index, 1);
	}
	
	isInside(x,y) {
		return (Math.sqrt(Math.pow(this.x-x,2)+Math.pow(this.y-y,2)) <= this.r);
	}
	
	isPointWithinDistance(x,y,d) {
		return (Math.sqrt(Math.pow(this.x-x,2)+Math.pow(this.y-y,2)) <= d+this.r);
	}
	
	//TO FIX FOR MULTI
	getTransition(condition) {
		for (var i in this.edges) {
			for (var z in this.edges[i].conditions) {
				if (this.edges[i].conditions[z] === condition) {
					return this.edges[i].otherNode;
				}
			}
		}
		return null;
	}
	
	toString(indent) {
		var tNum = indent || 0; //indent number
		var t = ''; //indent string
		var edges = '';
		for (var i=0; i<tNum; i++) {
			t += '\t';
		}
		for (var i=0; i<(this.edges.length || 0); i++) {
			edges += this.edges[i].toString(tNum + 2);
			if (i<this.edges.length-1) {
				edges += '\n';
			}
		}
		
		return t + "Node: \n\t" +
			t + "id: " + this.id + "\n\t" +
			t + "x: " + this.x + "  y: " + this.y + "  r: " + this.r + "\n\t" +
			t + "edges: \n" + edges + "\n\t" +
			t + "accepting: " + this.accepting + "\n\t" +
			t + "initial: " + this.initial + "\n\t" +
			t + "color: " + this.color;
	}
	
	

}

class Edge {

	constructor(otherNode, conditions) {
		this.otherNode = otherNode;
		this.conditions = conditions;
		this.offsetX = 0;
		this.offsetY = 0;
	}
	
	//Getters
	get otherNode() {
		return this._otherNode;
	}
	get conditions() {
		return this._conditions;
	}
	get offsetX() {
		return this._offsetX;
	}
	get offsetY() {
		return this._offsetY;
	}
	
	//Setters
	set otherNode(node) {
		if (!(node instanceof Node)) {
			throw new Error('node must be a Node, you gave a ' + (typeof node));
		}
		this._otherNode = node;
	}
	set conditions(conditions) {
		//throw error if edges is not an array
		if (!(conditions instanceof Array)) {
			throw new Error('conditions must be an Array. You gave ' +  typeof conditions);
		}
		
		this._conditions = conditions;
	}
	set offsetX(offsetX) {
		this._offsetX = offsetX;
	}	
	set offsetY(offsetY) {
		this._offsetY = offsetY;
	}
	
	toString(indent) {
		var tNum = indent || 0; //indent number
		var t = ''; //indent string
		for (var i=0; i<tNum; i++) {
			t += '\t';
		}
		return t + "Edge: \n\t" +
			t + "'" + this.conditions + "'->" + this.otherNode.id;
	}

}


function testClasses() {
	

	//document.write("A<BR>");
	//console.log(graph.toString());
	var testNode = true;
	var testPass = true;
	var allPassed = true;
			
	var x = 50;
	var y = 100;
	var r = 20;
	
	var graph = new DiGraph([new Node('Zebra',x,y,r)]);

	graph.addNode(new Node('Apple',x,y,r,null,true,true));
	graph.addNode(new Node('Bus',x,y,r));
	graph.addNode(new Node('Cat',x,y,r));

	console.log(graph);
	console.log(graph.getNode("Bus"));

	var node = new Node('Zebra',x,y,r);
	console.log('Object reference test. When the object changes, all that reference it should adjust accordingly');
	graph = new DiGraph([node,node,node,node,node]);
	console.log(graph);
	node.id = "Horse";
	node.accepting = true;
	node.initial = true;
	console.log(graph);

	//Node tests
	if (testNode) {
		console.log("Testing Node Class:");
		try {
			var badNode = Node();
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			var badNode = Node('ExampleNode',x,y,r,[1,2,3]);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			node = new Node('Pizza',x,y,r, null, 1);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			node = new Node('Pizza',x,y,r, 123);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			node = new Node('Pizza',x,y,r, null, 1);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			node = new Node('Pizza',x,y,r, null, true, 1);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		try {
			node = new Node('Pizza',x,y,r, [123]);
			testPass = false;
		} 
		catch(e) {
			testPass = true;
		}
		console.log('Pass: ' + testPass);
		
		node = new Node('Pizza',x,y,r);
		node = new Node('Pizza',x,y,r,null);
		node = new Node('Pizza',x,y,r,null,true);
		node = new Node('Pizza',x,y,r,null,false);
		node = new Node('Pizza',x,y,r,[],null,true);
		node = new Node('Pizza',x,y,r,[],null,false);
		node = new Node('Pizza',x,y,r,[],true,true);
		node = new Node('Pizza',x,y,r,[],true,true);		
		
		console.log('Pass: ' + testPass);
		
		burp = new Node('Toast',x,y,r,[],false,true);
		bell = new Node('Kitten',x,y,r,[],true,false);
		node.addEdge(new Edge(burp,[1]));
		node = new Node('Pizza',x,y,r,[new Edge(burp,[1]), new Edge(bell,[0])],true,true);
		
		if (node.id!=='Pizza' || 
		    burp.id!=='Toast' ||
			node.accepting!==true ||
			node.initial!==true ||
			node.edges.length!==2 ||
			node.edges[0].otherNode!==burp ||
			node.edges[0].otherNode.id!=='Toast' ||
			node.edges[1].otherNode!==bell 
			) {
			testPass = false;
		}
		
		
		console.log('Pass: ' + testPass);
		

		console.log(graph.toString());
		
		
		node = new Node('TestRange',0,0,20);
		var x = 20;
		var y = 0;
		
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = -20;
		var y = 0;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = 0;
		var y = 20;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = 0;
		var y = -20;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = -21;
		var y = 0;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = 21;
		var y = 0;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = 0;
		var y = -21;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")
		var x = 0;
		var y = 21;
		console.log(node.isInside(x,y)+": ("+x+","+y+") is in ("+node.x+","+node.y+")")

		console.log("\n\n"); //New tests for multi-conditional edges

	}
}

//testClasses();










