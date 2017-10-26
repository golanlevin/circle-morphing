var nPoints;
var radius;
var cx, cy;
var trianglePoints = [];
var srcPoints = []; // points on the circle
var dstPoints = []; // points on the triangle
var bShowDebug = false;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  nPoints = 60;
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;

  for (var i = 0; i < 3; i++) { // triangle vertices
    var x = cx + radius * cos(i * TWO_PI / 3.0 - HALF_PI);
    var y = cy + radius * sin(i * TWO_PI / 3.0 - HALF_PI);
    trianglePoints[i] = {
      x, y
    };
  }

  // compute srcPoints: points on the circle
  for (var j = 0; j < nPoints; j++) {
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var srcx = cx + radius * cos(t);
    var srcy = cy + radius * sin(t);
    var x = srcx;
    var y = srcy;
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - 6) / (nPoints / 3)) + 1) % 3;
    var p1x = trianglePoints[i].x;
    var p1y = trianglePoints[i].y;
    var p2x = trianglePoints[(i + 1) % 3].x;
    var p2y = trianglePoints[(i + 1) % 3].y;

    var p3x = cx;
    var p3y = cy;
    var p4x = srcPoints[j].x;
    var p4y = srcPoints[j].y;

    // http://paulbourke.net/geometry/pointlineplane/ 
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

  stroke(0);
  strokeWeight(3);
  beginShape();
  var t = map(sin(millis() / 2000.0), -1, 1, 0, 1);
  for (var j = 0; j < nPoints; j++) {
    var px = map(t, 0, 1, srcPoints[j].x, dstPoints[j].x);
    var py = map(t, 0, 1, srcPoints[j].y, dstPoints[j].y);
    vertex(px, py);
  }
  endShape(CLOSE);
  drawDebug(); 
}

//-----------------------------------------
function keyPressed(){
  bShowDebug = !bShowDebug; 
}

//-----------------------------------------
function drawDebug() {
  if (bShowDebug) {
    stroke(255,0,0,64);
    strokeWeight(1);
    var t = map(sin(millis() / 2000.0), -1, 1, 0, 1);
    for (var j = 0; j < nPoints; j++) {
      line(srcPoints[j].x, srcPoints[j].y, dstPoints[j].x, dstPoints[j].y);
    }
  }
}