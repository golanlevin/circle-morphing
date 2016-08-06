// Convert a circle into a square
// by progressively deleting all points
// except for the square's corners
// Golan Levin, August 2016

var xpoints = [];
var ypoints = [];
var npointsInit = 360;
var deleteAtIndex;
var bTransforming;
var notTransformingCount;
var nFinalSides = 4; // square

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
  rotate(PI * -0.75);
  beginShape();
  for (var i = 0; i < xpoints.length; i++) {
    var px = xpoints[i];
    var py = ypoints[i];
    vertex(px, py);
  }
  endShape(CLOSE);

  var nPointsPerSide = npointsInit / nFinalSides;
  if (bTransforming) {
    deleteAtIndex--;
    if ((deleteAtIndex%nPointsPerSide) == 0){
      deleteAtIndex--;
    }
    xpoints.splice(deleteAtIndex, 1);
    ypoints.splice(deleteAtIndex, 1);
    if (xpoints.length == nFinalSides) {
      bTransforming = false;
    }
  }
  pop();

  if (!bTransforming){
    notTransformingCount++;
    if (notTransformingCount > 60){
      mousePressed(); 
    }
  }
}

function mousePressed() {
  if (bTransforming || (xpoints.length == nFinalSides)) {
    bTransforming = false;
    initialize();
  } else {
    bTransforming = true;
    deleteAtIndex = npointsInit;
    notTransformingCount = 0; 
  }
}

function initialize() {
  notTransformingCount = 0;
  var radius = width / 2 * 0.75;
  for (var i = 0; i < npointsInit; i++) {
    var t = map(i, 0, npointsInit, 0, -TWO_PI);
    var px = radius * cos(t);
    var py = radius * sin(t);
    xpoints[i] = px;
    ypoints[i] = py;
  }
}