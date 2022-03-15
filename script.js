let nodes = [];
let node_vels = [];
let vertices = [];
let pointsToAddToVertex = [];
let nodesToAddToVertex = [];
let vertexWeights = [];
let nodeIdList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] //when we want to have more nodes, we can combine them e.g. AA, AB... etc
let nodeIdListCounter = 0;
let nodeTextList = [];
let graph = {};
let graphCounter = 0;

class Node{
    constructor(xPos, yPos){
        this.node = ellipse(xPos, yPos, 50, 50);
        this.nodeId = nodeIdList[nodeIdListCounter];
        nodeIdListCounter += 1;
        this.position = createVector(xPos, yPos);
        this.velocity = createVector(0, 0);
        this.fill = [197, 159, 201];
        this.clicked = false;
    }
    wobble(i){
        let newX = node_vels[i][0];
        let newY = node_vels[i][1];
        this.position.add(Math.sin(newX)/10,Math.sin(newY)/10);
        node_vels[i][0] += Math.random() * 0.05;
        node_vels[i][1] += Math.random() * 0.06;
    }
    show(){
        fill(this.fill[0],this.fill[1],this.fill[2]);
        this.node = ellipse(this.position.x, this.position.y, 50, 50);
    }
}

class Vertex{
    constructor(startX, startY, endX, endY){
        this.position = [startX, startY, endX, endY];
        this.vertex = line(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.startEndNodes = [];
    }
    followNodes(){
        this.position = [this.startEndNodes[0].position.x, this.startEndNodes[0].position.y, this.startEndNodes[1].position.x, this.startEndNodes[1].position.y]
        this.vertex = line(this.startEndNodes[0].position.x, this.startEndNodes[0].position.y, this.startEndNodes[1].position.x, this.startEndNodes[1].position.y);
    }
}

class Weight{
    constructor(weight, vertex){
        this.value = weight;
        this.text = text(this.value, 0, 0);
        this.position = createVector(0, 0);
        this.vertex = vertex;
    }
    followVertex(){
        let x_dist = this.vertex.position[0] - this.vertex.position[2];
        let y_dist = this.vertex.position[1] - this.vertex.position[3];
        let mid_x = (this.vertex.position[0] - x_dist / 2);
        let mid_y = (this.vertex.position[1] - y_dist / 2);
        this.text = text(this.value, mid_x, mid_y);
    }
}

class NodeText{
    constructor(node){
        this.node = node
        this.text = text(node.nodeId, node.position.x, node.position.y);
    }
    followNode(node){
        this.text = text(nodes[node].nodeId, nodes[node].position.x-4, nodes[node].position.y+5);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function setup() {
    createCanvas(1500, 1000);
    background(65, 65, 65);
}

function draw() {
    background(244, 244, 225);
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].followNodes();
    }
    for (let i = 0; i < nodes.length; i++) {
        noStroke();
        nodes[i].show();
        nodes[i].wobble(i);
    }
    for (let i = 0; i < vertexWeights.length; i++) {
        fill(0,0,0);
        stroke(51)
        strokeWeight(2)
        vertexWeights[i].followVertex();
    }
    for (let i = 0; i < nodeTextList.length; i++) {
        fill(23,42,200);
        textSize(15);
        nodeTextList[i].followNode(i);
    }
}


function addToGraph(nodesToAddToVertex, weight){
    let node1 = nodesToAddToVertex[0].nodeId;
    let node2 = nodesToAddToVertex[1].nodeId;
    console.log("nodes " + node1 + " " + node2)
    let obj = {[node2] : weight.value};
    //let graphKeys = Object.keys(graph);
    if (graph[node1] == null) {
        graph[node1] = obj;
    }
    graph[node1] = Object.assign(graph[node1], {[node2] : weight.value});
    console.log("Graph:     ", graph)
    console.log("----------------")
}

function calculate(){
    console.log("HI");
    let keys = Object.keys(graph);
    let subkeys = Object.keys(graph[keys[keys.length-1]]);
    graph[subkeys[subkeys.length-1]] = {};
    let results = dijkstra(graph)
    console.log('dijkstra', results);
    console.log(graph);
    dijkstraNodeColorChange(results);
    document.getElementById('whole-graph').innerHTML += JSON.stringify(graph);
    document.getElementById('optimum-path').innerHTML += JSON.stringify(results.path);
}

function dijkstraNodeColorChange(results){
    let path = results.path
    for (let node = 0; node < nodes.length; node++) {
        for(let i = 0; i < path.length; i++){
            console.log("Node: ", nodes[node].nodeId, " Node Path: ", path[i])
            if(nodes[node].nodeId == path[i]){
                nodes[node].fill = [248, 217, 214];
            }
        }
    }
}

function clickedOnNode(){
    for (let node = 0; node < nodes.length; node++) {
        let currentNode = nodes[node];
        //console.log("yes")
        //console.log()
        let d = dist(mouseX, mouseY, currentNode.position.x, currentNode.position.y);
        if (d < 25) {
            //let newNode = new Node(currentNode.position.x, currentNode.position.y);
            //newNode.fill = [143,141,29];
            if (nodesToAddToVertex.includes(currentNode)){
                console.log("Current Node:", currentNode);
                let indexOfNode = nodesToAddToVertex.indexOf(currentNode);
                let indexOfXPos = pointsToAddToVertex.indexOf(currentNode.position.x);
                let indexOfYPos = pointsToAddToVertex.indexOf(currentNode.position.y);
                nodesToAddToVertex.splice(indexOfNode,1);
                pointsToAddToVertex.splice(indexOfXPos,1);
                pointsToAddToVertex.splice(indexOfYPos,1);
                currentNode.fill = [200,200,200];
            }
            else{
                if (pointsToAddToVertex.length <= 4){
                    pointsToAddToVertex.push(currentNode.position.x);
                    pointsToAddToVertex.push(currentNode.position.y);
                    nodesToAddToVertex.push(currentNode);
                    currentNode.fill = [164, 222, 249];
                    //console.log("Vertices added:", pointsToAddToVertex);
                    //console.log(nodesToAddToVertex);
                }
                else{
                    while (pointsToAddToVertex.length) { pointsToAddToVertex.pop(); }
                    while (nodesToAddToVertex.length) { nodesToAddToVertex.pop(); }
                }
                if (pointsToAddToVertex.length == 4){
                    //console.log("2");
                    let vertex = new Vertex(pointsToAddToVertex[0],pointsToAddToVertex[1],pointsToAddToVertex[2],pointsToAddToVertex[3]);
                    vertex.startEndNodes = nodesToAddToVertex.slice();
                    let weight = new Weight(getRandomInt(20), vertex);
                    vertices.push(vertex);
                    vertexWeights.push(weight);
                    //console.log(nodesToAddToVertex, weight);
                    addToGraph(nodesToAddToVertex, weight);
                    while (pointsToAddToVertex.length) { pointsToAddToVertex.pop(); }
                    while (nodesToAddToVertex.length) { nodesToAddToVertex.pop(); }
                }
            }
            return true
        }
        
    }
}
// When the user clicks the mouse
function mousePressed() {
    if(!clickedOnNode()){
        let newNode = new Node(mouseX, mouseY);
        let newNodeText = new NodeText(newNode);
        nodes.push(newNode);
        nodeTextList.push(newNodeText);
        node_vels.push([0,0]);
        //console.log(nodes);
    }    
}

const findLowestCostNode = (costs, processed) => {
    const knownNodes = Object.keys(costs)
    
    const lowestCostNode = knownNodes.reduce((lowest, node) => {
        if (lowest === null && !processed.includes(node)) {
          lowest = node;
        }
        if (costs[node] < costs[lowest] && !processed.includes(node)) {
          lowest = node;
        }
        return lowest;
    }, null);
  
    return lowestCostNode
  };

//CREDIT: Stella Chung @stll.chung at HackerNoon 
// function that returns the minimum cost and path to reach Finish
const dijkstra = (graph) => {
    let keys = Object.keys(graph)
    start = keys[0]
    finish = keys[keys.length-1]
    console.log('Graph: ')
    console.log(graph)

    // track lowest cost to reach each node
    const trackedCosts = Object.assign({finish: Infinity}, graph[start]);
    console.log('Initial `costs`: ')
    console.log(trackedCosts)

    // track paths
    const trackedParents = {finish: null};
    for (let child in graph[start]) {
        trackedParents[child] = 'A';
    }
    console.log('Initial `parents`: ')
    console.log(trackedParents)

    // track nodes that have already been processed
    const processedNodes = [];

    // Set initial node. Pick lowest cost node.
    let node = findLowestCostNode(trackedCosts, processedNodes);
    console.log('Initial `node`: ', node)

    console.log('while loop starts: ')
    while (node) {
        console.log(`***** 'currentNode': ${node} *****`)
        let costToReachNode = trackedCosts[node];
        let childrenOfNode = graph[node];

        for (let child in childrenOfNode) {
        let costFromNodetoChild = childrenOfNode[child]
        let costToChild = costToReachNode + costFromNodetoChild;

        if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
            trackedCosts[child] = costToChild;
            trackedParents[child] = node;
        }

        console.log('`trackedCosts`', trackedCosts)
        console.log('`trackedParents`', trackedParents)
        console.log('----------------')
        }

        processedNodes.push(node);

        node = findLowestCostNode(trackedCosts, processedNodes);
    }
    console.log('while loop ends: ')
    let optimalPath = [finish];
    let parent = trackedParents[finish];
    while (parent) {
        optimalPath.push(parent);
        parent = trackedParents[parent];
    }
    optimalPath.reverse();

    const results = {
        distance: trackedCosts[finish],
        path: optimalPath
    };

    return results;
};