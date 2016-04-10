var xpoints = [];
var ypoints = [];
var npointsInit = 360;
var deleteAtIndex;
var bTransforming;

function setup() {
  createCanvas(400, 400);
  bTransforming = false;
  initialize();
}

function draw() {
  background(255, 255, 255);
  noFill(); 
  stroke(0);
  strokeWeight(3); 
  
  push();
  translate(width / 2, height / 2);
  rotate(-HALF_PI);
  beginShape();
  for (var i = 0; i < xpoints.length; i++) {
    var px = xpoints[i];
    var py = ypoints[i];
    vertex(px, py);
  }
  endShape(CLOSE);
  
  if (bTransforming) {
    deleteAtIndex--;
    if ((deleteAtIndex == (2*npointsInit/3)) || (deleteAtIndex == (npointsInit/3))){
      deleteAtIndex--;
    }
    xpoints.splice(deleteAtIndex, 1);
    ypoints.splice(deleteAtIndex, 1);
    if (xpoints.length == 3) {
      bTransforming = false;
    }
  }
  pop();
}

function mousePressed() {
  if (bTransforming || (xpoints.length == 3)){
    bTransforming = false;
    initialize();
  } else {
    bTransforming = true;
    deleteAtIndex = npointsInit - 1;
  }
}

function initialize() {
  var radius = width/2 * 0.75; 
  for (var i = 0; i < npointsInit; i++) {
    var t = map(i, 0, npointsInit, 0, -TWO_PI);
    var px = radius * cos(t);
    var py = radius * sin(t);
    xpoints[i] = px;
    ypoints[i] = py;
  }
}