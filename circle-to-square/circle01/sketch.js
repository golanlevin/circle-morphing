// Transform a circle into a square
// by progressively deleting all points
// except for the square's corners
// Golan Levin, January 2017

var origXpoints = []; 
var origYpoints = []; 
var xpoints = [];
var ypoints = [];
var npointsInit = 360;
var deleteAtIndex;
var notTransformingCount;
var pauseLength = 30; 
var nFinalSides = 4; // square
var direction; 

function setup() {
  createCanvas(400, 400);
  bTransforming = false;
  initialize();
  
  direction = 0; 
  deleteAtIndex = npointsInit;
  notTransformingCount = 0; 
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
  
  switch (direction){
    case 0: 
      deleteAtIndex--;
      if ((deleteAtIndex%nPointsPerSide) === 0){
        deleteAtIndex--;
      }
      xpoints.splice(deleteAtIndex, 1);
      ypoints.splice(deleteAtIndex, 1);
      if (xpoints.length == nFinalSides) {
        notTransformingCount = 0; 
        direction = 1; 
      }
      break; 
    
    case 1:
      notTransformingCount++;
      if (notTransformingCount > pauseLength){
        direction = 2;
      }
      break;
      
    case 2: 
      xpoints.splice(deleteAtIndex, 0, origXpoints[deleteAtIndex]);
      ypoints.splice(deleteAtIndex, 0, origYpoints[deleteAtIndex]);
      deleteAtIndex++;
      if ((deleteAtIndex%nPointsPerSide) === 0){
        deleteAtIndex++;
      }
      
      if (xpoints.length == npointsInit) {
        notTransformingCount = 0; 
        direction = 3; 
      }
      break;
      
    case 3:
      notTransformingCount++;
      if (notTransformingCount > pauseLength){
        direction = 0;
      }
      break;
  }
  
  pop();
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
    origXpoints[i] = px;
    origYpoints[i] = py;
  }
}