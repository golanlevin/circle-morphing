// Convert a circle into a square
// by moving points evenly sampled along the circle, 
// towards points on the square, resampled at equal intervals.
// Golan Levin, August 2016

var radius;
var nPoints, quarter;
var shiftQuadrant = 0;
var nSquarePoints = 4;
var counter = 0;
var squarePoints = []; // the 4 vertices of the square
var srcPoints = []; // points along the circle
var dstPoints = []; // points along the square
var curPercents = []; // percentages of interpolation
var bDrawDebug = true;
var bDoSkipQuadrant = true;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  nPoints = 360;
  quarter = (nPoints / nSquarePoints);
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquarePoints; i++) {
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = {
      x, y
    };
  }

  // compute srcPoints: points on the circle. Also reset curPercents.
  for (var j = 0; j < nPoints; j++) {
    curPercents[j] = 0;
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = radius * cos(t);
    var y = radius * sin(t);
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the square
  for (var j = 0; j < nPoints; j++) {
    var x1 = 0;
    var y1 = 0;
    var x2 = srcPoints[j].x;
    var y2 = srcPoints[j].y;

    var i = (floor((j + nPoints) / quarter) + 1) % nSquarePoints;
    var x3 = squarePoints[(i + 0) % nSquarePoints].x;
    var y3 = squarePoints[(i + 0) % nSquarePoints].y;
    var x4 = squarePoints[(i + 1) % nSquarePoints].x;
    var y4 = squarePoints[(i + 1) % nSquarePoints].y;

    var numra = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    var numrb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    var ua = numra / denom;
    var ub = numrb / denom;
    var x = x1 + ua * (x2 - x1);
    var y = y1 + ua * (y2 - y1);
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

  if (mouseIsPressed) { // whoa
    rotate(HALF_PI + PI - map(counter + 1, 0, nPoints, 0, TWO_PI));
  } else {
    rotate(PI * 0.25);
  }


  counter = (counter + 1) % (nPoints);

  if (!bDoSkipQuadrant) {
    curPercents[counter] = 1 - curPercents[counter];
  } else {
    var curQuadrant = int(counter / quarter);
    if (curQuadrant != shiftQuadrant) {
      curPercents[counter] = 1 - curPercents[counter];
    }
    if (counter === 0) {
      shiftQuadrant = (shiftQuadrant + 1) % (nSquarePoints + 1);
    }
  }

  if (bDrawDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    px = map(curPercents[counter], 0, 1, srcPoints[counter].x, dstPoints[counter].x);
    py = map(curPercents[counter], 0, 1, srcPoints[counter].y, dstPoints[counter].y);
    line(0, 0, px, py);
  }

  stroke(0);
  strokeWeight(3);
  strokeJoin(MITER);
  beginShape();
  for (var i = 0; i < nPoints; i++) {
    var pcti = curPercents[i];
    var pctj = curPercents[(i + 1) % nPoints];
    px = map(pcti, 0, 1, srcPoints[i].x, dstPoints[i].x);
    py = map(pcti, 0, 1, srcPoints[i].y, dstPoints[i].y);
    vertex(px, py);

    if (((pcti !== pctj) && (!bDoSkipQuadrant)) ||
      ((pcti !== pctj) && (bDoSkipQuadrant) && (((i + 1) % quarter) != 0))) {
      qx = map(pctj, 0, 1, srcPoints[i].x, dstPoints[i].x);
      qy = map(pctj, 0, 1, srcPoints[i].y, dstPoints[i].y);
      vertex(qx, qy);
    }
  }
  endShape(CLOSE);
  pop();
}