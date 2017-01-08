// Transform a circle into a square
// by progressively moving points evenly sampled along the circle, 
// towards points on the square, resampled at equal intervals,
// by small random amounts.
// Golan Levin, January 2017

var nPoints, quarter, offset;
var radius;
var nSquareCorners = 4;
var squareCorners = []; // the 4 vertices of the square
var circlePoints = []; // points, sampled along the circle
var squarePoints = []; // points, sampled along the square
var curPercents = []; // percentages of interpolation
var durPercents = [];
var bDrawDebug = false;
var direction = 1.0;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  nPoints = 80;
  quarter = (nPoints / nSquareCorners);
  offset = 0; 
  radius = width / 2 * 0.75;

  // compute location of the square's corners.
  for (var i = 0; i < nSquareCorners; i++) { // square vertices
    var x = radius * cos(i * TWO_PI / nSquareCorners - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquareCorners - HALF_PI);
    squareCorners[i] = { x, y };
  }

  // compute circlePoints: points on the circle. Also reset curPercents.
  for (var j = 0; j < nPoints; j++) {
    durPercents[j] = curPercents[j] = 0.0;
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = radius * cos(t);
    var y = radius * sin(t);
    circlePoints[j] = { x, y };
  }

  // compute squarePoints: points along the square/polygon
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - offset) / quarter) + 1) % nSquareCorners;
    var p1x = squareCorners[(i + 0) % nSquareCorners].x;
    var p1y = squareCorners[(i + 0) % nSquareCorners].y;
    var p2x = squareCorners[(i + 1) % nSquareCorners].x;
    var p2y = squareCorners[(i + 1) % nSquareCorners].y;

    var jt = (j + nPoints - (offset - 0)) % quarter;
    var x = map(jt, 0, quarter, p1x, p2x);
    var y = map(jt, 0, quarter, p1y, p2y);
    squarePoints[j] = { x, y };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push();
  translate(width / 2, height / 2);
  rotate(PI * 0.25);

  if (bDrawDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    for (var j = 0; j < nPoints; j++) {
      line(circlePoints[j].x, circlePoints[j].y, squarePoints[j].x, squarePoints[j].y);
    }
  }

  stroke(0);
  strokeWeight(3);
  for (var j = 0; j < nPoints; j++) { // move the curPercents inward, randomly
    curPercents[j] += (direction * 0.01) * (noise(j * 10 + millis() / 1000.0) - 0.15);
    curPercents[j] = constrain(curPercents[j], 0, 1);
    durPercents[j] = curPercents[j];
  }
  var A = 0.98;
  var B = (1.0 - A) / 2.0;
  var errorSum = 0;
  for (var j = 0; j < nPoints; j++) { // blur the boundary
    var i = ((j - 1) + nPoints) % nPoints;
    var k = ((j + 1) /*    */ ) % nPoints;
    curPercents[j] = (B * durPercents[i]) + (A * durPercents[j]) + (B * durPercents[k]);
    errorSum += (direction > 0) ? (1.0 - curPercents[j]) : (curPercents[j]);
  }

  if (errorSum < 0.00001) { // reset if it's close to being a square or circle. 
    direction = -1 * direction;
    noiseSeed(millis());
    for (var j = 0; j < nPoints; j++) {
      curPercents[j] = (direction > 0) ? 0.0 : 1.0;
    }
  }

  for (var i = 0; i < nSquareCorners; i++) {
    var begin = (i * quarter);
    var end = ((i + 1) * quarter) - 1;
    var px, py;
    beginShape(); {
      px = squareCorners[(i + 1) % nSquareCorners].x;
      py = squareCorners[(i + 1) % nSquareCorners].y;
      vertex(px, py);
      vertex(px, py);
      for (var j = begin; j < end; j++) {
        var k = ((j + offset) + nPoints) % nPoints;
        px = map(curPercents[k], 0, 1, circlePoints[k].x, squarePoints[k].x);
        py = map(curPercents[k], 0, 1, circlePoints[k].y, squarePoints[k].y);
        curveVertex(px, py);
      }
      px = squareCorners[(i + 2) % nSquareCorners].x;
      py = squareCorners[(i + 2) % nSquareCorners].y;
      vertex(px, py);
      vertex(px, py);
    }
    endShape();
  }
  pop();
}

function keyPressed(){
  bDrawDebug = !bDrawDebug;
}