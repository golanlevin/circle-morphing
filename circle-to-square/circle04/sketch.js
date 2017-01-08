// Transform a circle into a square
// by linearly interpolating points on the circle
// towards points on the square, along radii of the circle
// Golan Levin, January 2017

var nPoints;
var radius;
var cx, cy;
var nVertices = 4;
var squarePoints = [];
var srcPoints = []; // points on the circle
var dstPoints = []; // points on the square
var bDrawDebug = true;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  nPoints = 60;
  radius = width / 2 * 0.75;
  cx = 0;
  cy = 0;

  for (var i = 0; i < nVertices; i++) { // square vertices
    var x = cx + radius * cos(i * TWO_PI / nVertices - HALF_PI);
    var y = cy + radius * sin(i * TWO_PI / nVertices - HALF_PI);
    squarePoints[i] = { x, y };
  }

  // compute srcPoints: points on the circle
  for (var j = 0; j < nPoints; j++) {
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var srcx = cx + radius * cos(t);
    var srcy = cy + radius * sin(t);
    var x = srcx;
    var y = srcy;
    srcPoints[j] = { x, y };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - 1) / (nPoints / nVertices)) + 1) % nVertices;
    var p1x = squarePoints[i].x;
    var p1y = squarePoints[i].y;
    var p2x = squarePoints[(i + 1) % nVertices].x;
    var p2y = squarePoints[(i + 1) % nVertices].y;

    var p3x = cx;
    var p3y = cy;
    var p4x = srcPoints[j].x;
    var p4y = srcPoints[j].y;

    // See: http://paulbourke.net/geometry/pointlineplane/ 
    var numea = (p4x - p3x) * (p1y - p3y) - (p4y - p3y) * (p1x - p3x);
    var numeb = (p2x - p1x) * (p1y - p3y) - (p2y - p1y) * (p1x - p3x);
    var denom = (p4y - p3y) * (p2x - p1x) - (p4x - p3x) * (p2y - p1y);
    var ua = numea / denom;
    var ub = numeb / denom;
    var u = 1.0;
    if ((ua >= 0) && (ua <= 1)) {
      u = ua;
    } else if ((ub >= 0) && (ub <= 1)) {
      u = ub;
    }
    var dstx = p1x + u * (p2x - p1x);
    var dsty = p1y + u * (p2y - p1y);

    var x = dstx;
    var y = dsty;
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

  stroke(0);
  strokeWeight(3);
  beginShape();
  for (var j = 0; j < nPoints; j++) {
    var t = map(sin(millis() / 2000.0), -1, 1, 0, 1);
    var px = map(t, 0, 1, srcPoints[j].x, dstPoints[j].x);
    var py = map(t, 0, 1, srcPoints[j].y, dstPoints[j].y);
    vertex(px, py);
  }
  endShape(CLOSE);

  if (bDrawDebug) {
    for (var j = 0; j < nPoints; j++) {
      stroke(255, 0, 0, 64);
      strokeWeight(1);
      line(srcPoints[j].x, srcPoints[j].y, dstPoints[j].x, dstPoints[j].y);
    }
  }
  pop();
}

function keyPressed(){
  bDrawDebug = !bDrawDebug;
}