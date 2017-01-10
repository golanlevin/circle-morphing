// Convert a circle into a triangle, by xeno's interpolation
// Golan Levin, January 2017

var radius;
var cx, cy;
var nCirclePoints;
var circlePoints = [];

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;

  nCirclePoints = 120;
  for (var i = 0; i < nCirclePoints; i++) {
    var t = map(i, 0, nCirclePoints, 0, TWO_PI) - HALF_PI;
    var x = cx + radius * cos(t);
    var y = cy + radius * sin(t);
    circlePoints[i] = {
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
  strokeJoin(ROUND);

  beginShape();
  var ptsPerTriSide = nCirclePoints / 3;
  for (var i = 0; i < nCirclePoints; i++) {
    if (i % ptsPerTriSide !== 0) {
      var h = (i - 1 + nCirclePoints) % nCirclePoints;
      var j = (i + 1 + nCirclePoints) % nCirclePoints;
      circlePoints[i].x = (1.0*circlePoints[h].x + 1.0*circlePoints[i].x + 1.0*circlePoints[j].x) / 3.0;
      circlePoints[i].y = (1.0*circlePoints[h].y + 1.0*circlePoints[i].y + 1.0*circlePoints[j].y) / 3.0;
    }
    vertex(circlePoints[i].x, circlePoints[i].y);
  }
  endShape(CLOSE);
}
