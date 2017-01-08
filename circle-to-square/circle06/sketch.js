// Transform a circle into a square
// by treating it as a rounded rect
// whose rounded corners have a shrinking radius.
// Golan Levin, January 2017

var radius;
var squareCorners = [];
var nSquareCorners = 4;
var bDrawDebug = true;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquareCorners; i++) { // triangle vertices
    var x = radius * cos(i * TWO_PI / nSquareCorners - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquareCorners - HALF_PI);
    squareCorners[i] = { x, y };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push();
  translate(width / 2, height / 2);
  rotate(PI * 0.25);

  var currentRadii01 = 0.5 + 0.5 * sin(millis() / 2000.0);
  var rad = currentRadii01 * radius;

  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);
  beginShape();
  for (var i = 0; i < nSquareCorners; i++) {
    var px = map(currentRadii01, 0, 1, squareCorners[i].x, 0);
    var py = map(currentRadii01, 0, 1, squareCorners[i].y, 0);

    var ang1 = (i + 0) * TWO_PI / nSquareCorners + HALF_PI / 2 + PI;
    var ang2 = (i + 1) * TWO_PI / nSquareCorners + HALF_PI / 2 + PI;
    var dang = (ang2 - ang1) / (180.0 / nSquareCorners);
    for (var t = ang1; t <= ang2; t += dang) {
      var ax = px + rad * cos(t);
      var ay = py + rad * sin(t);
      vertex(ax, ay);
    }
  }
  endShape(CLOSE);

  if (bDrawDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    for (var i = 0; i < nSquareCorners; i++) {
      var px = map(currentRadii01, 0, 1, squareCorners[i].x, 0);
      var py = map(currentRadii01, 0, 1, squareCorners[i].y, 0);
      line (0, 0, px, py);
    }
  }
  pop();
}

function keyPressed(){
  bDrawDebug = !bDrawDebug; 
}