// Convert a circle into a square
// by progressively moving points evenly sampled along the circle, 
// towards points on the square, resampled at equal intervals,
// by small random amounts.
// Golan Levin, August 2016

var nPoints, quarter, offset;
var radius;
var nSquarePoints = 4;
var squarePoints = []; // the 4 vertices of the square
var srcPoints = []; // points along the circle
var dstPoints = []; // points along the square
var curPercents = []; // percentages of interpolation
var durPercents = [];
var bDrawDebug = true;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  nPoints = 80;
  quarter = (nPoints / nSquarePoints);
  offset = 0; //nPoints / 10;
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquarePoints; i++) { // triangle vertices
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = {
      x, y
    };
  }

  // compute srcPoints: points on the circle. Also reset curPercents.
  for (var j = 0; j < nPoints; j++) {
    durPercents[j] = curPercents[j] = 0.0;
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = radius * cos(t);
    var y = radius * sin(t);
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - offset) / quarter) + 1) % nSquarePoints;
    var p1x = squarePoints[(i + 0) % nSquarePoints].x;
    var p1y = squarePoints[(i + 0) % nSquarePoints].y;
    var p2x = squarePoints[(i + 1) % nSquarePoints].x;
    var p2y = squarePoints[(i + 1) % nSquarePoints].y;

    var jt = (j + nPoints - (offset - 0)) % quarter;
    var x = map(jt, 0, quarter, p1x, p2x);
    var y = map(jt, 0, quarter, p1y, p2y);
    dstPoints[j] = {
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

  if (bDrawDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    for (var j = 0; j < nPoints; j++) {
      line(srcPoints[j].x, srcPoints[j].y, dstPoints[j].x, dstPoints[j].y);
    }
  }

  stroke(0);
  strokeWeight(3);
  for (var j = 0; j < nPoints; j++) { // move the curPercents inward, randomly
    curPercents[j] += 0.01 * (noise(j * 10 + millis() / 1000.0) - 0.15);
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
    errorSum += 1.0 - curPercents[j];
  }

  if (errorSum < 0.00001) { // reset if it's close to being a square. 
    noiseSeed(millis());
    for (var j = 0; j < nPoints; j++) {
      curPercents[j] = 0.0;
    }
  }

  for (var i = 0; i < nSquarePoints; i++) {
    var begin = (i * quarter);
    var end = ((i + 1) * quarter) - 1;
    var px, py;
    beginShape(); {
      px = squarePoints[(i + 1) % nSquarePoints].x;
      py = squarePoints[(i + 1) % nSquarePoints].y;
      vertex(px, py);
      vertex(px, py);
      for (var j = begin; j < end; j++) {
        var k = ((j + offset) + nPoints) % nPoints;
        px = map(curPercents[k], 0, 1, srcPoints[k].x, dstPoints[k].x);
        py = map(curPercents[k], 0, 1, srcPoints[k].y, dstPoints[k].y);
        curveVertex(px, py);
      }
      px = squarePoints[(i + 2) % nSquarePoints].x;
      py = squarePoints[(i + 2) % nSquarePoints].y;
      vertex(px, py);
      vertex(px, py);
    }
    endShape();
  }
  pop();
}