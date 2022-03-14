
let nodes = [];
let node_vels = [];
let vertices = [];
let pointsToAddToVertex = [];
let nodesToAddToVertex = [];
let vertexWeights = []
let nodeIdList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
let nodeIdListCounter = 0;
let graph = {};
let graphCounter = 0;


class Node{
    constructor(xPos, yPos){
        this.node = ellipse(xPos, yPos, 50, 50);
        this.nodeId = nodeIdList[nodeIdListCounter];
        nodeIdListCounter += 1;
        this.position = createVector(xPos, yPos);
        this.velocity = createVector(0, 0);
        this.fill = [200,200,200];
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function setup() {
    createCanvas(720, 400);
    background(127);
}

function draw() {
    background(127);
    for (let i = 0; i < vertexWeights.length; i++) {
        fill(0,0,0);
        vertexWeights[i].followVertex();
    }
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].followNodes();
    }
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].show();
        nodes[i].wobble(i);
    }
}


function addToGraph(nodesToAddToVertex, weight){
    let node1 = nodesToAddToVertex[0].nodeId;
    let node2 = nodesToAddToVertex[1].nodeId;
    console.log("nodes " + node1 + " " + node2)
    let obj = {[node2] : weight.value};
    let graphKeys = Object.keys(graph);
    if (graph[node1] == null) {
        graph[node1] = obj;
    }
    graph[node1] = Object.assign(graph[node1], {[node2] : weight.value});
    console.log("Graph:     ", graph)
    console.log("----------------")
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
                    currentNode.fill = [143,141,29];
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
                    let weight = new Weight(10, vertex);
                    vertices.push(vertex);
                    vertexWeights.push(weight);
                    //console.log(nodesToAddToVertex, weight);
                    addToGraph(nodesToAddToVertex, weight);
                    while (pointsToAddToVertex.length) { pointsToAddToVertex.pop(); }
                    while (nodesToAddToVertex.length) { nodesToAddToVertex.pop(); }
                }
            }
            
            //nodes[node] = newNode;
            //console.log(currentNode);
            //console.log("in node")
            
            return true
        }
        
    }
}
// When the user clicks the mouse
function mousePressed() {
    if(!clickedOnNode()){
        let newNode = new Node(mouseX, mouseY);
        nodes.push(newNode);
        node_vels.push([0,0]);
        //console.log(nodes);
    }    
}