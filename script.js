
let nodes = [];
let node_vels = [];
let vertices = [];
let verticesToAdd = [];
let tx = 0;
let ty = 0;

class Node{
    constructor(xPos, yPos){
        this.node = ellipse(xPos, yPos, 50, 50);
        this.position = createVector(xPos, yPos);
        this.velocity = createVector(0, 0);
        this.fill = [200,200,200];
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
    }
    followNodes(){
        
    }
    show(){
        this.vertex = line(this.position[0], this.position[1], this.position[2], this.position[3]);
    }
}

function setup() {
    createCanvas(720, 400);
    background(127);
}

function draw() {
    background(127);
    line(100,100,200,200);
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].show();
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].show();
        nodes[i].wobble(i);
    }
}

function clickedOnNode(){
    for (let node = 0; node < nodes.length; node++) {
        let currentNode = nodes[node];
        console.log("yes")
        console.log()
        let d = dist(mouseX, mouseY, currentNode.position.x, currentNode.position.y);
        if (d < 25) {
            //let newNode = new Node(currentNode.position.x, currentNode.position.y);
            //newNode.fill = [143,141,29];
            if (verticesToAdd.length <= 4){
                verticesToAdd.push(currentNode.position.x);
                verticesToAdd.push(currentNode.position.y);
                console.log("Vertices added:", verticesToAdd);
            }
            if (verticesToAdd.length == 4){
                console.log("2");
                let vertex = new Vertex(verticesToAdd[0],verticesToAdd[1],verticesToAdd[2],verticesToAdd[3]);
                vertices.push(vertex);
                while (verticesToAdd.length) { verticesToAdd.pop(); }
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
        console.log(nodes);
    }    
}