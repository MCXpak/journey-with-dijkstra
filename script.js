let main = document.getElementById('main'), two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(main);

let circ = two.makeCircle(two.width/2, two.height/2, 50 ,50);

const gravity = new Two.Vector(0, 0.66);

circ.velocity = new Two.Vector();

let circles = []
let circle_vels = []

circles.push(circ)
circle_vels.push([0,0])
console.log(circle_vels)
let xPos = 0;
let yPos = 0;

function randColor(){
    return Math.floor(Math.random()*16777215).toString(16);
}

window.addEventListener('pointerdown', pointerdown, false);

function createNode(){
    let x = event.clientX;
    let y = event.clientY;
    let n = two.makeCircle(x, y, 50 ,50);
    n.fill = randColor();
    n.velocity = new Two.Vector();
    circles.push(n);
    circle_vels.push([0,0])
}

function pointerdown(e){
    createNode()
}

function wobble(shape, node, l){
    shape.translation.addSelf(shape.velocity);
    shape.velocity.x = (Math.sin(l[node][0])/10)
    shape.velocity.y = (Math.sin(l[node][1])/10)
    l[node][0] += Math.random() * 0.05;
    l[node][1] += Math.random() * 0.05;
}

two.bind('update', function() {
    for(let node = 0; node < circles.length; node++){
        wobble(circles[node], node, circle_vels);
    }
});
