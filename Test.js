//Author - Austin Ash (2017)

window.onload = function() {

var nodeRadius = 40;	// Radius of each node
var edgeSpace = 5; 		// Space between edge and node
var arrowLength = 10; 	// Length of edge arrows
var nodeLineWidth = 2;	// Width of the lines drawn around each node

var mode = "general";	// "general" - Adding Nodes and Transitions
						// "input"	 - Getting an input from the user

var diGraph = new DiGraph();

var nodeConfig = {
	'title': document.getElementById("nodeConfigTitle"),
	'id': document.getElementById("nodeConfigId"),
	'color': document.getElementById("nodeConfigColor"),
	'accepting': document.getElementById("nodeConfigAccepting"),
	'initial': document.getElementById("nodeConfigInitial"),
	'node': null
};

var transitionConfig = {
	'title': document.getElementById("transitionConfigTitle"),
	'to': document.getElementById("transitionConfigTo"),
	'from': document.getElementById("transitionConfigFrom"),
	'conditions': document.getElementById("transitionConfigCondition"),
	'node': null,
	'edge': null
};

var colors = {
	'blue': '#4286f4',
	'yellow': '#ffee56',
	'red': '#ff5959',
	'blue': '#4286f4',
	'green': '#5dfc58',
	'cyan': '#63f7ff',
	'pink': '#f082ff',
	'purple': '#4248ff',
	'limegreen': '#32CD32'
};

canvas = document.getElementById('myCanvas');
context = canvas.getContext('2d');
context.canvas.width = document.body.clientWidth;
context.canvas.height = window.innerHeight;

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.canvas.width = document.body.clientWidth;
ctx.canvas.height = window.innerHeight;
	
	

function drawNode(x, y, id, accepting, initial, color) {
	if ((typeof(x)!=="number") || (typeof(y)!=="number")) {
		throw new Error('drawNode must take a number for both x and y. You gave: x=' + x + ' y=' + y);
	}
	if ((x<0) || (y<0)) {
		throw new Error('drawNode must take positive x and y parameters. You gave: x=' + x + ' y=' + y);
	}
	if (typeof(id)!=="string") {
		throw new Error('drawNode must have a valid string for the id parameter. You gave: ' + typeof(id));
	}
	
	if (initial === true) {
		drawInitial( x, y);
    }
	
	context.beginPath(); 
	context.moveTo(x+nodeRadius,y);
	context.arc(x, y, nodeRadius, 0, 2*Math.PI, false);
	if (accepting === true) {
		context.moveTo(x+nodeRadius-5,y);
		context.arc(x, y, nodeRadius-5, 0, 2 * Math.PI, false);
    }

	if (color !== null) {
		if (typeof(color) === "string") {
			context.fillStyle = color;
		} else if (typeof(color === undefined)) {
			context.fillStyle = "#ffffff";
		} else {
			throw new Error('drawNode was given an invalid color: ' + color);
		}
		context.fill();
	}
    context.lineWidth = nodeLineWidth;
    context.strokeStyle = '#333333';
	context.moveTo(x,y);
    context.stroke();
	
	//Write ID
	context.beginPath();
	context.font = "25px Cambria Math";
	context.fillStyle = '#333333';
	context.textAlign="center"; 
	context.textBaseline="middle"; 
	context.fillText(id,x,y);
	context.fill()
	context.stroke();
}


function drawInitial( x, y) {
	var p = getArrowPoints(x-nodeRadius-edgeSpace, y, x-(nodeRadius*2), y);	
	
	//context.beginPath();
	context.beginPath();
	context.fillStyle = '#000000';
	context.lineWidth = 2;
	context.moveTo(x-edgeSpace-nodeRadius*2, y);
	context.lineTo(p.c.x-arrowLength/2, p.c.y);
	context.stroke();
	
	context.beginPath();
	context.lineWidth = 1;
	context.moveTo(p.c.x, p.c.y);
	context.lineTo(p.b.x, p.b.y);
	context.lineTo(p.a.x, p.a.y);
	context.lineTo(p.c.x, p.c.y);
	context.fillStyle = '#000000';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
	//context.stroke();

}


//Gets the x,y on edge of node that is closest to another point
function nearestPointOnNodeEdge(x1, y1, x2, y2, radius) {
	var a = x2 - x1;
	var b = y2 - y1; 
	var scale = Math.sqrt(a * a + b * b);
	return {
		'x': x1 + a * (radius+edgeSpace) / scale,
		'y': y1 + b * (radius+edgeSpace) / scale
	};
};


//Gets the angle from one point to another
function getAngleTo(x1, y1, x2, y2) {
	return (Math.atan2(y2-y1,x2-x1));
}


//Gets the points of arrow from a point to a destination (From, To)
function getArrowPoints(x1, y1, x2, y2) {
	/*
	console.log(
		"x1:"+x1+"\n"+
		"y1:"+y1+"\n"+
		"x2:"+x2+"\n"+
		"y2:"+y2+"\n"
	);
	*/
	
	var angle = getAngleTo(x1, y1, x2, y2);
	var t = 0.15*Math.PI;
	//console.log(angle);
	var p = {
		'a': {
			'x':x1+((arrowLength)*Math.cos(angle+t)),
			'y':y1+((arrowLength)*Math.sin(angle+t))
		},
		'b': {
			'x':x1+((arrowLength)*Math.cos(angle-t)),
			'y':y1+((arrowLength)*Math.sin(angle-t))
		},
		'c': {
			'x':x1,
			'y':y1
		}
	};
	
	return p;
}


function drawArrow(x, y, cX, cY) {

	var p = getArrowPoints(x, y, cX, cY);
	
	context.beginPath();
	context.moveTo(p.a.x, p.a.y);
	context.lineTo(p.b.x, p.b.y);
	context.lineTo(p.c.x, p.c.y);
	context.fillStyle = '#000000';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
	context.stroke();
}

function getCP(x1, y1, x2, y2) {
	var hypo = (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
	
	var pointsA = nearestPointOnNodeEdge(x1, y1, x2, y2, nodeRadius);
	var pointsB = nearestPointOnNodeEdge(x2, y2, x1, y1, nodeRadius+arrowLength);
	
	var yStart = pointsA.y;
	var yEnd = pointsB.y;
	
	var midX = ((x1+x2)/2);
	var midY = ((yStart+yEnd)/2);
	var arcOffset = hypo/8;
	
	var slope = ((y2-y1)/(x2-x1));
	var oppSlope = ((-1)/slope);	
	var misc = Math.sqrt((1*1)+(oppSlope*oppSlope));
	var cpX = (arcOffset * (1/misc));
	var cpY = (arcOffset * (oppSlope/misc));
	if (y1>y2) {
		cpX *= -1;
		cpY *= -1;
	}
			
	//Special case for when Slope is 0 or infinity
	if (!isFinite(slope)) {
		if (y1>y2) {
			cpX = -arcOffset;
		}
	}else if (!isFinite(oppSlope)) {
		if (x1>x2) {
			cpY = arcOffset;
		} else {
			cpY = -arcOffset
		}
	}
	
	cpX += midX;
	cpY += midY;
	
	return [cpX, cpY];
}

//x1, y1 are the center of the first node
//x2, y2 are the center of the second node
function drawEdge(x1, y1, x2, y2, cond, oX, oY) {

	var hypo = (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
	
	var pointsA = nearestPointOnNodeEdge(x1, y1, x2, y2, nodeRadius);
	var pointsB = nearestPointOnNodeEdge(x2, y2, x1, y1, nodeRadius+arrowLength);
	
	var yStart = pointsA.y;
	var yEnd = pointsB.y;
	
	var midX = ((x1+x2)/2);
	var midY = ((yStart+yEnd)/2);
	var arcOffset = hypo/8;
	
	var slope = ((y2-y1)/(x2-x1));
	var oppSlope = ((-1)/slope);	
	var misc = Math.sqrt((1*1)+(oppSlope*oppSlope));
	var cpX = (arcOffset * (1/misc));
	var cpY = (arcOffset * (oppSlope/misc));
	if (y1>y2) {
		cpX *= -1;
		cpY *= -1;
	}
			
	//Special case for when Slope is 0 or infinity
	if (!isFinite(slope)) {
		if (y1>y2) {
			cpX = -arcOffset;
		}
	}else if (!isFinite(oppSlope)) {
		if (x1>x2) {
			cpY = arcOffset;
		} else {
			cpY = -arcOffset
		}
	}
	
	cpX += midX;
	cpY += midY;
	
	//edge Offset
	cpX += oX;
	cpY += oY;
	
	pointsA = nearestPointOnNodeEdge(x1, y1, cpX, cpY, nodeRadius);
	pointsB = nearestPointOnNodeEdge(x2, y2, cpX, cpY, nodeRadius+arrowLength);
	
		
	var xStart = pointsA.x;
	var yStart = pointsA.y;
	var xEnd = pointsB.x;
	var yEnd = pointsB.y;
	
	//console.log("CP: "+cpX+","+cpY);
	context.moveTo(xStart,yStart);
	context.lineWidth = 2;
	
	//Control Box Visual
	context.fillStyle = '#000000';
	//context.fillRect(cpX, cpY, 5, 5); 
	
	//Edge curve
	context.quadraticCurveTo(cpX, cpY, xEnd, yEnd);
	context.stroke();
	
	//Draw conditions
	drawEdgeConditions(xStart, yStart, xEnd, yEnd, cpX, cpY, cond, 0.5);
	
	//Arrow
	var arrowStart = nearestPointOnNodeEdge(x2, y2, cpX, cpY, nodeRadius);
	drawArrow(arrowStart.x, arrowStart.y, cpX, cpY);
		
	//Left arrow corner
	var a = x2-cpX;      
	var b = y2-cpY;
	var aY = 0;	
	
	//Right arrow corner
	var bX = 0;
	var bY = 0;
}

//x1, y1 are the center of node
//t is the direction
function getSelfConditionPos(x, y, t) {
	var spread = 0.1;
	var cpD = 50 + nodeRadius;

	var cp = {
		'a': {
			'x':x + (cpD*Math.cos((t-spread)*Math.PI)),
			'y':y + (cpD*Math.sin((t-spread)*Math.PI))
		},
		'b': {
			'x':x + (cpD*Math.cos((t+spread)*Math.PI)),
			'y':y + (cpD*Math.sin((t+spread)*Math.PI))
		},
	};
	
	var start = nearestPointOnNodeEdge(x, y, cp.a.x, cp.a.y, nodeRadius);
	var end = nearestPointOnNodeEdge(x, y, cp.b.x, cp.b.y, nodeRadius+arrowLength);
	
	//Draw Conditions
	var points = [
		start,
		cp.a,
		cp.b,
		end
	];
	
	var dist = 15
	var A = getBezierPoint(points, .5-0.025);
	var B = getBezierPoint(points, .5+0.025);
	var mid = [(A.x+B.x)/2, (A.y+B.y)/2];
	var angle = getAngleTo(A.x, A.y, B.x, B.y);

	var pos = [mid[0] - (dist*Math.sin(angle+(1*Math.PI))), mid[1] + (dist*Math.cos(angle-(1*Math.PI)))];
	return pos;
}

//x1, y1 are the center of node
//t is the direction
function drawEdgeSelf(x, y, cond, t) {
	var spread = 0.1;
	var cpD = 50 + nodeRadius;
	console.log([x,y] + ": (x,y)");
	//console.log(Math.sin(t*Math.PI)) + ": Math.sin("+t+"*PI): ";
	//console.log(Math.cos(t*Math.PI)) + ": Math.cos("+t+"*PI): ";
	
	var cp = {
		'a': {
			'x':x + (cpD*Math.cos((t-spread)*Math.PI)),
			'y':y + (cpD*Math.sin((t-spread)*Math.PI))
		},
		'b': {
			'x':x + (cpD*Math.cos((t+spread)*Math.PI)),
			'y':y + (cpD*Math.sin((t+spread)*Math.PI))
		},
	};
	
	var start = nearestPointOnNodeEdge(x, y, cp.a.x, cp.a.y, nodeRadius);
	var end = nearestPointOnNodeEdge(x, y, cp.b.x, cp.b.y, nodeRadius+arrowLength);
	
	//Draw Curve
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineWidth = 2;
	context.fillStyle = '#000000';
	context.bezierCurveTo(cp.a.x, cp.a.y, cp.b.x, cp.b.y, end.x, end.y);
	context.stroke();
	
	//Draw Arrow
	var arrowStart = nearestPointOnNodeEdge(x, y, cp.b.x, cp.b.y, nodeRadius);
	drawArrow(arrowStart.x, arrowStart.y, cp.b.x, cp.b.y,);
	
	//Draw Conditions
	var points = [
		start,
		cp.a,
		cp.b,
		end
	];
	var bezPoint = getBezierPoint(points, t);
	
	var dist = 15
	var A = getBezierPoint(points, .5-0.025);
	var B = getBezierPoint(points, .5+0.025);
	var mid = [(A.x+B.x)/2, (A.y+B.y)/2];
	var angle = getAngleTo(A.x, A.y, B.x, B.y);

	context.beginPath();
	context.font="20px Cambria Math";
	context.fillStyle = '#000000';
	var pos = [mid[0] - (dist*Math.sin(angle-(1*Math.PI))), mid[1] + (dist*Math.cos(angle-(1*Math.PI)))];
	context.fillText(cond.join(),pos[0],pos[1]);
	context.stroke();
	
}

//x1, y1 are the center of the first node
//x2, y2 are the center of the second node
function getConditionsPoint(x1, y1, x2, y2, oX, oY) {
	var hypo = (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
	
	var pointsA = nearestPointOnNodeEdge(x1, y1, x2, y2, nodeRadius);
	var pointsB = nearestPointOnNodeEdge(x2, y2, x1, y1, nodeRadius+arrowLength);
	
	var yStart = pointsA.y;
	var yEnd = pointsB.y;
	
	var midX = ((x1+x2)/2);
	var midY = ((yStart+yEnd)/2);
	var arcOffset = hypo/8;
	
	var slope = ((y2-y1)/(x2-x1));
	var oppSlope = ((-1)/slope);	
	var misc = Math.sqrt((1*1)+(oppSlope*oppSlope));
	var cpX = (arcOffset * (1/misc));
	var cpY = (arcOffset * (oppSlope/misc));
	if (y1>y2) {
		cpX *= -1;
		cpY *= -1;
	}
			
	//Special case for when Slope is 0 or infinity
	if (!isFinite(slope)) {
		if (y1>y2) {
			cpX = -arcOffset;
		}
	}else if (!isFinite(oppSlope)) {
		if (x1>x2) {
			cpY = arcOffset;
		} else {
			cpY = -arcOffset
		}
	}
	
	cpX += midX;
	cpY += midY;
	
	//edge Offset
	cpX += oX;
	cpY += oY;
	
	pointsA = nearestPointOnNodeEdge(x1, y1, cpX, cpY, nodeRadius);
	pointsB = nearestPointOnNodeEdge(x2, y2, cpX, cpY, nodeRadius+arrowLength);
	
	var xStart = pointsA.x;
	var yStart = pointsA.y;
	var xEnd = pointsB.x;
	var yEnd = pointsB.y;
	
	//Draw conditions
	var dist = 15
	var A = getQuadraticPoint(xStart, yStart, xEnd, yEnd, cpX, cpY, 0.5-0.025);
	var B = getQuadraticPoint(xStart, yStart, xEnd, yEnd, cpX, cpY, 0.5+0.025);
	var mid = [(A[0]+B[0])/2, (A[1]+B[1])/2];
	var angle = getAngleTo(A[0], A[1], B[0], B[1]);

	var pos = [mid[0] - (dist*Math.sin(angle-(1*Math.PI))), mid[1] + (dist*Math.cos(angle-(1*Math.PI)))];
	return pos;
	
}


//x1,y1 - start
//x2,y2 - end
//cx,cy - control
//t		- 0 to 1, percent from start to end
function getQuadraticPoint(x1, y1, x2, y2, cx, cy, t) {
	if (typeof t !== 'number') {
			throw new Error('getQuadraticPoint() must take seven numbers');
	}
	if (t>1 || t<0) {
			throw new Error('getQuadraticPoint() parameter t must be from 0 to 1');
	}
	var x = (1-t) * (1-t) * x1 + 2 * (1-t) * t * cx + t * t * x2;
	var y = (1-t) * (1-t) * y1 + 2 * (1-t) * t * cy + t * t * y2;
	return [x,y];
}

function bezierHelper(d, p) {
  var r = [];
  for (var i=1; i<d.length; i++) {
    var d0 = d[i-1], d1 = d[i];
    r.push({x: d0.x + (d1.x - d0.x) * p, y: d0.y + (d1.y - d0.y) * p});
  }
  return r;
}

function getBezierPoint(points, t) {
	var x = [points.slice(0, 4)];
	for (var i=1; i<4; i++) {
		x.push(bezierHelper(x[x.length-1], t));
	}
	return x[x.length-1][0];
}


function drawDiGraph() {
	console.log(""+diGraph);
	if (!(diGraph instanceof DiGraph)) {
		throw new Error('drawDiGraph must take a DiGraph object for the second parameter. You gave: ' +  typeof diGraph);
	}
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var nodes = diGraph.nodes;
	//console.log(nodes);
	
	//Draw Nodes first
	for (var i=0; i<(nodes.length || 0); i++) {
		var n = nodes[i];
		drawNode(n.x, n.y, n.id, n.accepting, n.initial, n.color);
		
	}
	
	//Draw Edges second
	for (var i=0; i<(nodes.length || 0); i++) {
		var n = nodes[i];
		var edges = n.edges;
		for (var j=0; j<(edges.length); j++) {
			//console.log(1);
			var e = edges[j];
			if (n !== e.otherNode) {
				drawEdge(n.x, n.y, e.otherNode.x, e.otherNode.y, e.conditions, e.offsetX, e.offsetY);
			} else {
				//Edge to self
				console.log("TODO-Edge To Self");
				drawEdgeSelf(n.x, n.y, e.conditions, Math.atan2(e.offsetX, e.offsetY));
				var p = getSelfConditionPos(n.x, n.y, Math.atan2(e.offsetX, e.offsetY));;
				//context.fillRect(p[0], p[1], 10, 10);
			}
		}
	}
}


function drawEdgeConditions(x1, y1, x2, y2, cx, cy, cond, t) {
	var dist = 15
	var A = getQuadraticPoint(x1, y1, x2, y2, cx, cy, t-0.025);
	var B = getQuadraticPoint(x1, y1, x2, y2, cx, cy, t+0.025);
	var mid = [(A[0]+B[0])/2, (A[1]+B[1])/2];
	var angle = getAngleTo(A[0], A[1], B[0], B[1]);

	context.font="20px Cambria Math";
	context.fillStyle = '#000000';
	var pos = [mid[0] - (dist*Math.sin(angle-(1*Math.PI))), mid[1] + (dist*Math.cos(angle-(1*Math.PI)))];
	context.fillText(cond.join(),pos[0],pos[1]);
}

//Returns a nearby edge and the node it came from in order [node,edge]
function getNearbyConditions(x, y, d) {
	var nodes = diGraph.nodes;
	for (var i=0; i<(nodes.length || 0); i++) {
		var edges = nodes[i].edges;
		//console.log(edges+"\n");
		for (var z=0; z<(edges.length || 0); z++) {
			var otherNode = edges[z].otherNode;
			var p;
			if (nodes[i]===otherNode) {
				p = getSelfConditionPos(nodes[i].x, nodes[i].y, Math.atan2(edges[z].offsetX, edges[z].offsetY));
				//context.fillRect(p[0], p[1], 10, 10);
			} else {
				p = getConditionsPoint(nodes[i].x, nodes[i].y, otherNode.x, otherNode.y, edges[z].offsetX, edges[z].offsetY);
			}
			//p[0] += edges[z].offsetX;
			//p[1] += edges[z].offsetY;
			if ((Math.sqrt(Math.pow(x-p[0],2)+Math.pow(y-p[1],2)) <= d)) {
				return ([nodes[i], edges[z]]);
			}
		}
	}
	return null;
}

//UI Stuff
function nodeConfigNew(node) { //Require node parameter after test
	
	// Current node values
	nodeConfig.title.innerHTML = node.id;
	nodeConfig.id.placeholder = node.id;
	nodeConfig.color.placeholder = node.color;
	nodeConfig.accepting.checked = node.accepting;
	nodeConfig.initial.checked = node.initial;
	
	// Reset Text Fields
	nodeConfig.id.value = "";
	nodeConfig.color.value = "";
	
	nodeConfig.node = node;
	
	mode = "input";
	$("#nodeConfig").modal({backdrop: 'static', keyboard: false});
}


function nodeConfigSave() {
	
	//Catch invalid inputs
	var node = nodeConfig.node
	var error = false;
	//console.log(colors[nodeConfig.color.value]);
	if (colors[nodeConfig.color.value] !== undefined) {
		nodeConfig.color.value = colors[nodeConfig.color.value];
	} else if (!(/^#[0-9A-F]{6}$/i.test(nodeConfig.color.value)) && (nodeConfig.color.value!=="")) {
		console.log("TODO - Color error!");
		error = true;
	} 
	if (nodeConfig.id.value !== '') {
		var dup = diGraph.getNode(nodeConfig.id.value);
		if ((dup !== undefined) && (dup !== node)) {
			console.log("TODO - Duplicate Node ID!");
			error = true;
		}
	}
	if (!(error)) {
		
		//Save changes
		if (nodeConfig.color.value !== '') {
			node.color = nodeConfig.color.value;
		}
		if (nodeConfig.id.value !== '') {
			node.id = nodeConfig.id.value;
		}
		node.initial = nodeConfig.initial.checked;
		node.accepting = nodeConfig.accepting.checked;
		
		$("#nodeConfig").modal('hide');
		mode = "general";
		
		drawDiGraph();
	} else {
		//Display some error;
	}
	
}

function nodeConfigCancel() {
	console.log("TODO");
	$("#nodeConfig").modal('hide');
	mode = "general";
}

function transitionConfigNew(node, edge) { 
	
	transitionConfig.from.value = "";
	transitionConfig.to.value = "";
	transitionConfig.conditions.value = "";
	if (node !== undefined) {
		transitionConfig.node = node;
		transitionConfig.from.placeholder = node.id;
		if (edge !== undefined) {
			//Edge and node known
			transitionConfig.edge = edge;
			transitionConfig.title.innerHTML = node.id + "->" + edge.otherNode.id + " given '" + edge.conditions + "'";
			transitionConfig.to.placeholder = edge.otherNode.id;
			transitionConfig.conditions.placeholder = edge.conditions;
		} else {
			//Only node known
			transitionConfig.edge = undefined;
			transitionConfig.title.innerHTML = "New Transition";
			transitionConfig.to.placeholder = "";
			transitionConfig.conditions.placeholder = "";
		}
		
	} else {
		//blank
		transitionConfig.node = undefined;
		transitionConfig.edge = undefined;
		transitionConfig.title.innerHTML = "Under Development";
	}
	mode = "input";
	$("#transitionConfig").modal({backdrop: 'static', keyboard: false});
}

function transitionConfigSave() {
	
	var error = false;
	if ((diGraph.getNode(transitionConfig.to.value)===undefined)  && (transitionConfig.to.value!=="")) {
		console.log("ERROR - Node undefined!");
		error = true;
	}
	
	if (!(error)) { //Save changes
		var node = transitionConfig.node;
		var edge = transitionConfig.edge;
		if (node !== undefined) {
			if (edge !== undefined) {
				if (transitionConfig.to.value !== '') {
					edge.otherNode = diGraph.getNode(transitionConfig.to.value);
				}
				if (transitionConfig.conditions.value !== '') {
					edge.conditions = transitionConfig.conditions.value.split('');
				}
				$("#transitionConfig").modal('hide');
				mode = "general";
				
				drawDiGraph();
			}
		}
	} else {
		//Display some error;
	}

}

function transitionConfigCancel() {
	$("#transitionConfig").modal('hide');
	mode = "general";
}

function transitionConfigDelete() {	
	
	var error = false;
	var n = transitionConfig.node;
	var e = transitionConfig.edge;
	
	if (e === undefined) {
		console.log("ERROR - Tried to delete null edge");
		error = true;
	} else if (n === undefined) {
		console.log("ERROR - Tried to delete edge, but node was null");
		error = true;
	} else if (!(n.containsEdge(e))) {
		console.log("ERROR - Tried to delete edge, but it was not part of the given node:\n" + n + "\n" + e);
		error = true;
	} 
	
	if (!(error)) {
		//Delete Edge
		n.deleteEdge(e);
		$("#transitionConfig").modal('hide');
		mode = "general";
		drawDiGraph();
	}
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

	
var dragging = false;
var isCtrlDown = false;	
var mouseKey = 0;
var startNode = null;
var startX = null;
var startY = null;
var edgeX = null;
var edgeY = null;
var startEdge = null;
	
document.addEventListener("mousedown", function(e){
	//console.log(e);
	dragging = false;
	if (dragging == false) { //If a mouse key is already down, ignore others
		mouseKey = e.which;
		isCtrlDown = e.ctrlKey;
		if (mode == "general") {
			n = diGraph.getNodeInside(e.x, e.y);
			if (n !== null) {
				startNode = n;
				if (isCtrlDown) {
					console.log("Starting Edge");
				} else {
					console.log("Node Drag started")
				}
			} else if (getNearbyConditions(e.x, e.y, 10)) {
				//Edit edge
				var nodeAndEdge = getNearbyConditions(e.x, e.y, 10);
				if (nodeAndEdge !== null) {
					startX = e.x;
					startY = e.y;
					startEdge = nodeAndEdge[1];
					edgeX = startEdge.offsetX;
					edgeY = startEdge.offsetY;
				}
			} else {
				startNode = null;
				startEdge = null;
			}
		}
	} 
}, false);
var lastX;
var lastY;
document.addEventListener("mousemove", function(e){
	if ((lastX != e.x) && (lastY != e.y)) {
		lastX = e.x;
		lastY = e.y;

		if (dragging == false) {
			dragging = true;
		}
		//console.log(e.x+","+e.y);
		//console.log(mouseKey);
		if (mouseKey == 1) { // left click dragging
			if (isCtrlDown) {
				if (startNode !== null) {
					//console.log("Draw temp edge");
				}
			} else {
				if (startNode !== null) {
					if (diGraph.getNearbyNode(e.x, e.y, 80, startNode) == null) {
						startNode.x = e.x;
						startNode.y = e.y;
						drawDiGraph();
						//console.log("drag node");
					}	
				} else if (startEdge !== null) {
					var n = diGraph.getNodeByEdge(startEdge);
					if (n===startEdge) {
						startEdge.offsetX = (e.x-n.x);
						startEdge.offsetY = (e.y-n.y);
						console.log("A");
					} else {
						startEdge.offsetX = edgeX + (e.x-startX);
						startEdge.offsetY = edgeY + (e.y-startY);
					}
					drawDiGraph();
				}
			}
		} else if (mouseKey == 3) { // right click dragging
			//currently unused
		} else {
			//console.log("Unknown mouse press");
		}
	}
}, false);
document.addEventListener("mouseup", function(e){
	//e.preventDefault();
	if (mode == "general") {
		if  (mouseKey == 1) { //left mouse
			if (dragging){
				if (isCtrlDown) {
					if (startNode !== null) {
						var endNode = diGraph.getNodeInside(e.x, e.y);
						if (endNode !== null) {
							var cond = prompt("Please a transition conditions:", "0");
								
							cond = cond.split('');
							
							if (cond.length > 0) {
								var edge = new Edge(endNode,cond);
								startNode.addEdge(edge);
								drawDiGraph();
							}
						}
					}
				} else {
					//Unused
				} 
			}
			else{
				var n = diGraph.getNearbyNode(e.x, e.y, 80);
				//var tempEdge = diGraph.getEdgeInside(e.x, e.y);
				
				if (isCtrlDown) {
					if (startNode !== null) {
						var endNode = diGraph.getNodeInside(e.x, e.y);
						if (endNode === startNode) {
							//No mouse drag, but still transition to self
							var cond = prompt("Please a transition conditions:", "0");
							var edge = new Edge(endNode,cond);
							startNode.addEdge(edge);
							drawDiGraph();
						}
					}
				} else {
					if (n === null) {
						//Add new Node
						var id = prompt("Please enter a Node Id:", "Q"+diGraph.nodes.length);
						if (diGraph.getNode(id) === undefined) {
							var newNode = new Node(id, e.x, e.y);
							newNode.initial = diGraph.nodes.length<1; //First node default initial
							diGraph.addNode(newNode);
							drawDiGraph();
						} else {
							console.log("That node ID already exists");
						}
					} else {
						n = diGraph.getNodeInside(e.x, e.y);
						if (n !== null) {
							//Toggle Accepting
							n.accepting = (!(n.accepting));
							drawDiGraph();
						} else {	
							//To close to a node to add new
						}
					}
				}
			}
		} else if (mouseKey == 3) { // right click
			if (!(isCtrlDown)) {
				if (startNode !== null) {
					var endNode = diGraph.getNodeInside(e.x, e.y);
					if (endNode !== null) {
						if (startNode == endNode) {
							nodeConfigNew(startNode);
						}
					}
				} else if (getNearbyConditions(e.x, e.y, 10) ) {
					//Edit edge
					var nodeAndEdge = getNearbyConditions(e.x, e.y, 10);
					if (nodeAndEdge !== null) {
						console.log("TODO - Open Transition Config");
						transitionConfigNew(nodeAndEdge[0],nodeAndEdge[1]);
					}
				} else {
					//Context Menu
					
				}
			}
		}
		
		mouseKey = -1;
		dragging = false; //allow the next mouse click
		startNode = null;
		startEdge = null;
	}
}, false);


//Node Config
$("#nodeConfigSave").click(function(){
	nodeConfigSave();
});
$("#nodeConfigCancel").click(function(){
	nodeConfigCancel();
});
$("#nodeConfigClose").click(function(){
	nodeConfigCancel();
});

//Edge Config
$("#transitionConfigAdd").click(function(){
	transitionConfigSave();
});
$("#transitionConfigCancel").click(function(){
	transitionConfigCancel();
});
$("#transitionConfigClose").click(function(){
	transitionConfigCancel();
});
$("#transitionConfigDelete").click(function(){
	transitionConfigDelete();
});
	
canvas.oncontextmenu = function (e) {
	if (!(e.ctrlKey)) {
		e.preventDefault();
		mode = "input";
		$("#customContextMenu").css("left",e.pageX);
		$("#customContextMenu").css("top",e.pageY);       
		$("#customContextMenu").fadeIn(200,startFocusOut());
		
	} 
	//else, default context menu
};
$("#customContextMenuTestInput").click(function(e){
	mode = "input";
	$("#testInput").css("left",e.pageX);
	$("#testInput").css("top",e.pageY);   
	$("#testInput").fadeIn(200,startFocusOut());
});
$("#customContextMenuExport").click(function(){
	console.log("Export - Under development");
});
$("#customContextMenuInport").click(function(){
	console.log("Import - Under development");
});

function startFocusOut(){
	$(canvas).on("click",function(){
		$("#testInput").hide();        
		$("#customContextMenu").hide();        
		$(document).off("click");
		mode = "general";
	});
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$("#testInputSubmit").click(async function(){

	var inputText = document.getElementById("testInputText");
	var raw = inputText.value;
	var acceptColor = "#77ff77";
	var rejectColor = "#ff7777";
	var moveColor = "#77ffff";
	var delay = 1000;
	//console.log(raw);
		
	var input = raw.split("");
	var inputBreak = raw.split("");
	//console.log(input);
	
	//wait(2000);
		
	var n = diGraph.getInitial(); //start at initial
	var origColor = n.color;
	n.color = moveColor;
	drawDiGraph();
	await sleep(delay);
	var accept = true;
	inputText.placeholder = raw;
	for (var i in input) {
			
		inputBreak = inputBreak.slice(1,inputBreak.length);
		inputText.value = inputBreak.join('');
		//inputText.value = input.slice(i+1, input.length).join('');
			
		var tN = n.getTransition(input[i]);
			
		if (tN !== null && tN !== undefined) {
			n.color = origColor;
			n = tN;
			origColor = n.color;
			n.color = moveColor;
			
		} else {
			accept = false;
			break;
		}
		drawDiGraph();
		await sleep(delay);
	}
	
	if (accept && n.accepting) {
		n.color = acceptColor;
	} else {
		n.color = rejectColor;
	}
	drawDiGraph();
	await sleep(delay);
	n.color = origColor;
	drawDiGraph();
		
	
});


}

