// Convert a circle into a square
// by treating it as a rounded rect
// whose rounded corners have a shrinking radius.
// Golan Levin, August 2016

var radius;
var squarePoints = [];
var nSquarePoints = 4;
var bDrawDebug = false;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquarePoints; i++) { // triangle vertices
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = {
      x, y
    };
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
  for (var i = 0; i < nSquarePoints; i++) {
    var px = map(currentRadii01, 0, 1, squarePoints[i].x, 0);
    var py = map(currentRadii01, 0, 1, squarePoints[i].y, 0);

    var ang1 = (i + 0) * TWO_PI / nSquarePoints + HALF_PI / 2 + PI;
    var ang2 = (i + 1) * TWO_PI / nSquarePoints + HALF_PI / 2 + PI;
    var dang = (ang2 - ang1) / (180.0 / nSquarePoints);
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
    for (var i = 0; i < nSquarePoints; i++) {
      var px = map(currentRadii01, 0, 1, squarePoints[i].x, 0);
      var py = map(currentRadii01, 0, 1, squarePoints[i].y, 0);
      line(0, 0, px, py);
    }
  }
  pop();
}